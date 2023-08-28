use argon2::{
    password_hash::{rand_core::OsRng, SaltString},
    Argon2, PasswordHash, PasswordHasher, PasswordVerifier,
};
use axum::{extract::State, http::StatusCode, routing::post, Json, Router};
use jsonwebtoken::{encode, Header};
use prql_compiler_macros::prql_to_sql;
use rusqlite::OptionalExtension;
use secrecy::{ExposeSecret, SecretString};
use serde::{Deserialize, Serialize};
use serde_rusqlite::from_rows;
use tracing::{error, warn};

use crate::{
    auth::{AuthError, Claims, Permission, KEYS},
    models::User,
    util::{get_conn, internal_error},
    ServerState,
};

pub(crate) fn routes() -> Router<ServerState> {
    Router::new()
        .route("/", post(create_user))
        .route("/login", post(login))
}

#[derive(Deserialize)]
struct CreateUserRequest {
    name: String,
    display_name: String,
    password: String,
    group: Option<String>,
    avatar_hash: String,
}

async fn create_user(
    State(state): State<ServerState>,
    Json(req): Json<CreateUserRequest>,
) -> Result<Json<LoginResponse>, (StatusCode, String)> {
    let conn = get_conn(&state).await;

    let salt = SaltString::generate(&mut OsRng);

    let argon2 = Argon2::default();

    let password_hash = argon2
        .hash_password(req.password.as_bytes(), &salt)
        .unwrap()
        .to_string();

    let name_clone = req.name.clone();
    let execute = conn
        .interact(move |conn| {
            conn.execute(
                "insert into user (name, display_name, password_hash, avatar_hash) values (?1, ?2, ?3, ?4)",
                (&name_clone, &req.display_name, &password_hash, &req.avatar_hash),
            )
        })
        .await.unwrap();

    match execute {
        Ok(_) => {
            let resp = login(
                State(state),
                Json(LoginRequest {
                    name: req.name,
                    password: req.password.into(),
                }),
            )
            .await;
            Ok(resp.unwrap())
        }
        Err(rusqlite::Error::SqliteFailure(e, _)) if e.extended_code == 1555 => {
            error!("duplicate name while creating user");
            Err((StatusCode::CONFLICT, "name already exists".to_owned()))
        }
        Err(e) => {
            error!("error while creating user {:?}", e);
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                "internal error".to_owned(),
            ))
        }
    }
}

#[derive(Deserialize)]
struct LoginRequest {
    name: String,
    password: SecretString,
}

#[derive(Serialize)]
struct LoginResponse {
    access_token: String,
}

async fn login(
    State(state): State<ServerState>,
    Json(req): Json<LoginRequest>,
) -> Result<Json<LoginResponse>, AuthError> {
    let conn = get_conn(&state).await;

    let res = conn
        .interact(|conn| -> Result<_, rusqlite::Error> {
            let mut stmt = conn.prepare(prql_to_sql!(
                "from user
                filter name == $1"
            ))?;

            let res = stmt
                .query_row([req.name.clone()], |row| {
                    Ok(User {
                        name: row.get("name")?,
                        display_name: row.get("display_name")?,
                        avatar_hash: row.get("avatar_hash")?,
                        password_hash: SecretString::from(row.get::<_, String>("password_hash")?),
                        permissions: Vec::new(),
                    })
                })
                .optional()?;

            let mut stmt = conn.prepare(prql_to_sql!(
                "from user_permission
                filter user == $1
                select permission"
            ))?;

            let permissions = from_rows::<Permission>(stmt.query([req.name]).unwrap())
                .filter_map(Result::ok)
                .collect::<Vec<_>>();

            match res {
                Some(user) => Ok(Some(User {
                    permissions,
                    ..user
                })),
                None => Ok(None),
            }
        })
        .await
        .unwrap();

    let Ok(Some(user)) = res else {
        warn!("invalid login attempt");
        return Err(AuthError::WrongCredentials);
    };

    let parsed_hash = PasswordHash::new(&user.password_hash.expose_secret()).unwrap();
    let verified = Argon2::default()
        .verify_password(req.password.expose_secret().as_bytes(), &parsed_hash)
        .is_ok();

    if verified {
        let claims = Claims {
            sub: user.name.to_string(),
            display: user.display_name.clone(),
            permissions: user.permissions.clone(),
            exp: 2000000000,
        };

        let access_token = encode(&Header::default(), &claims, &KEYS.encoding)
            .map_err(|_| AuthError::TokenCreation)?;

        return Ok(Json(LoginResponse { access_token }));
    }

    Err(AuthError::WrongCredentials)
}

// async fn get_user_data()
