use std::collections::HashMap;

use axum::{
    extract::{Path, State},
    http::StatusCode,
    routing::{get, post},
    Json, Router,
};
use prql_compiler_macros::prql_to_sql;
use serde::Deserialize;
use time::OffsetDateTime;
use tracing::error;

use crate::{
    auth::{Claims, Permission},
    models::Challenge,
    util::get_conn,
    ServerState,
};

pub fn routes() -> Router<ServerState> {
    Router::new()
        .route("/", get(list_challenges))
        .route("/", post(create_challenge))
        .route("/:challenge_id", get(get_challenge))
        //.route("/:challenge_id/personal", get(get_user_challenge))
        .route("/:challenge_id", post(add_user_challenge))
        .route("/personal", get(list_user_challenges))
}

async fn get_challenge(
    State(state): State<ServerState>,
    Path(challenge_id): Path<String>,
) -> Result<Json<Challenge>, (StatusCode, String)> {
    let conn = get_conn(&state).await;

    let mut challenge = None;

    let mut tags = Vec::new();

    let res = conn
        .interact(move |conn| -> Result<_, rusqlite::Error> {
            let mut stmt = conn.prepare(prql_to_sql!(
                "from c = challenge
                filter c.id == $1
                join side:left ct = challenge_tag (ct.challenge == c.id)
                select {c.id, c.name, c.description, c.reward, c.required_amount, c.created_at, ct.tag}"
            ))?;


            let rows = stmt.query_and_then([&challenge_id], |row| -> Result<_, rusqlite::Error> {
                if let Ok(tag) = row.get::<_, String>(6) {
                    tags.push(tag);
                }

                challenge = Some(Challenge {
                    id: row.get(0)?,
                    hidden: false,
                    name: row.get(1)?,
                    description: row.get(2)?,
                    reward: row.get(3)?,
                    required_amount: row.get(4)?,
                    tags: Vec::new(),
                    created_at: OffsetDateTime::from_unix_timestamp(row.get(5)?).unwrap(),
                });
                Ok(())
            })?;
            rows.for_each(|_| {});

            Ok(Challenge {
                tags,
                ..challenge.unwrap()
            })
        }).await.unwrap();

    match res {
        Ok(ch) => Ok(Json(ch)),
        Err(e) => {
            error!("unable to retrieve challenge {e:?}");
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                "unknown server error".to_owned(),
            ))
        }
    }
}

async fn add_user_challenge(
    State(state): State<ServerState>,
    claims: Claims,
    Path(challenge_id): Path<String>,
) -> Result<StatusCode, (StatusCode, String)> {
    let conn = get_conn(&state).await;

    let res = conn
        .interact(move |conn| {
            conn.execute(
                "insert into user_challenge (challenge, 'user') values (?1, ?2)",
                [&challenge_id, &claims.sub],
            )
        })
        .await
        .unwrap();

    match res {
        Ok(_) => Ok(StatusCode::OK),
        Err(e) => {
            error!("error while adding user challenge progress: {e:?}");
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                "unknown internal server error".to_owned(),
            ))
        }
    }
}

// TODO: Merge the code for the two list challenges endpoints

async fn list_user_challenges(
    State(state): State<ServerState>,
    claims: Claims,
) -> Result<Json<Vec<Challenge>>, (StatusCode, String)> {
    let conn = get_conn(&state).await;

    let mut challenge_map: HashMap<(i64, i64), Challenge> = HashMap::new();

    let res = conn
        .interact(move |conn| -> Result<_, rusqlite::Error> {
            let mut stmt = conn.prepare(prql_to_sql!(
                "
                from uc = user_challenge
                filter uc.user == $1
                join c = challenge (c.id == uc.challenge)
                join side:left ct = challenge_tag (ct.challenge == c.id)
                select {c.id, c.name, c.description, c.reward, c.required_amount, c.created_at, ct.tag, uc_created = uc.created_at}"
            ))?;

            let rows = stmt.query_and_then([&claims.sub], |row| -> Result<_, rusqlite::Error> {
                let challenge = challenge_map.entry((row.get(0)?, row.get(7)?)).or_insert(Challenge { id: row.get(0)?, hidden: false, name: row.get(1)?, description: row.get(2)?, reward: row.get(3)?, required_amount: row.get(4)?, tags: Vec::new(), created_at: OffsetDateTime::from_unix_timestamp(row.get::<_, i64>(5)?).unwrap() });

                challenge.tags.push(row.get(6)?);

                Ok(())
            })?;
            rows.for_each(|_| {});

            Ok(challenge_map)
        })
        .await
        .unwrap().unwrap();

    Ok(Json(res.into_values().collect()))
}

async fn list_challenges(
    State(state): State<ServerState>,
    claims: Claims,
) -> Result<Json<Vec<Challenge>>, (StatusCode, String)> {
    let conn = get_conn(&state).await;

    let mut challenge_map: HashMap<i64, Challenge> = HashMap::new();

    let res = conn
        .interact(move |conn| -> Result<_, rusqlite::Error> {
            let mut stmt = conn.prepare(prql_to_sql!(
                "from challenge
                join side:left ct = challenge_tag (challenge.id == ct.challenge)
                filter challenge.hidden == 0
                select {challenge.id, challenge.name, challenge.description, challenge.reward, challenge.required_amount, challenge.created_at, ct.tag}"
            ))?;


            let rows = stmt.query_and_then([], |row| -> Result<_, rusqlite::Error> {
                let challenge = challenge_map.entry(row.get(0)?).or_insert(Challenge { id: row.get(0)?, hidden: false, name: row.get(1)?, description: row.get(2)?, reward: row.get(3)?, required_amount: row.get(4)?, tags: Vec::new(), created_at: OffsetDateTime::from_unix_timestamp(row.get::<_, i64>(5)?).unwrap() });

                challenge.tags.push(row.get(6)?);

                Ok(())
            })?;
            rows.for_each(|_| {});

            Ok(challenge_map)
        })
        .await
        .unwrap().unwrap();

    Ok(Json(res.into_values().collect()))
}

#[derive(Deserialize)]
struct CreateChallengeRequest {
    name: String,
    description: String,
    reward: i64,
    required_amount: i64,
    tags: Vec<String>,
}

async fn create_challenge(
    State(state): State<ServerState>,
    claims: Claims,
    Json(req): Json<CreateChallengeRequest>,
) -> Result<StatusCode, (StatusCode, String)> {
    let conn = get_conn(&state).await;

    if !claims.permissions.contains(&Permission::Admin) {
        return Err((
            StatusCode::UNAUTHORIZED,
            "user needs ADMIN permission to create challenges".to_owned(),
        ));
    }

    let res = conn.interact(move |conn| -> Result<(), rusqlite::Error> {
        let tx = conn.transaction()?;

        let id: i64 = tx.query_row("insert into challenge (name, description, reward, required_amount) values (?1, ?2, ?3, ?4) returning id", (&req.name, &req.description, req.reward, req.required_amount), |row| row.get(0))?;

        for tag in req.tags {
            tx.execute("insert into challenge_tag (challenge, tag) values (?1, ?2)", (id, tag))?;
        }

        tx.commit()?;

        Ok(())
    }).await.unwrap();

    match res {
        Ok(_) => Ok(StatusCode::OK),
        Err(e) => {
            error!("error while creating challenge: {e:?}");
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                "unable to create challenge".to_owned(),
            ))
        }
    }
}
