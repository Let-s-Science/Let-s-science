use axum::{
    extract::State,
    http::StatusCode,
    routing::{get, post},
    Json, Router,
};
use prql_compiler_macros::prql_to_sql;
use rand_core::{OsRng, RngCore};
use rusqlite::{Connection, DropBehavior};
use serde::{Deserialize, Serialize};
use serde_rusqlite::from_rows;
use tracing::error;

use crate::{auth::Claims, models::Group, util::get_conn, ServerState};

pub fn routes() -> Router<ServerState> {
    Router::new()
        .route("/", get(list_groups))
        .route("/", post(create_group))
        .route("/join", post(join_group))
}

async fn list_groups(
    State(state): State<ServerState>,
    claims: Claims,
) -> Result<Json<Vec<Group>>, (StatusCode, String)> {
    let conn = get_conn(&state).await;

    let res = conn
        .interact(move |conn| -> Result<_, rusqlite::Error> {
            let mut stmt = conn.prepare(prql_to_sql!(
                "default_db.group
                join ug=user_group (group.id == ug.group)
                filter ug.user == $1
                select {group.id,group.name,group.avatar_hash,group.join_phrase}"
            ))?;

            Ok(from_rows::<Group>(stmt.query([claims.sub]).unwrap())
                .filter_map(Result::ok)
                .collect::<Vec<_>>())
        })
        .await
        .unwrap();

    match res {
        Ok(groups) => Ok(Json(groups)),
        Err(e) => {
            error!("error while listing groups: {e:?}");
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                "unable to list groups".to_owned(),
            ))
        }
    }
}

#[derive(Debug, Deserialize)]
struct CreateGroupRequest {
    name: String,
    avatar_hash: String,
}

#[derive(Serialize)]
struct CreateGroupResponse {
    join_phrase: String,
}

async fn create_group(
    State(state): State<ServerState>,
    claims: Claims,
    Json(req): Json<CreateGroupRequest>,
) -> Result<Json<CreateGroupResponse>, (StatusCode, String)> {
    let conn = get_conn(&state).await;

    let mut key = [0u8; 4];
    OsRng.fill_bytes(&mut key);
    let mnemonic = mnemonic::to_string(&key);

    let res = conn
        .interact(move |conn| {
            let mut tx = conn.transaction()?;
            tx.set_drop_behavior(DropBehavior::Commit);

            let group_id = tx.query_row(
                "insert into 'group' (name, avatar_hash, join_phrase, created_by) values (?1, ?2, ?3, ?4) returning id",
                [&req.name, &req.avatar_hash, &mnemonic, &claims.sub],
                |row| row.get::<_, i64>(0)
            )?;

            add_user_to_group(&tx, &claims.sub, group_id)?;

            tx.commit()?;

            Ok(())
        })
        .await
        .unwrap();

    match res {
        Ok(_) => Ok(Json(CreateGroupResponse {
            join_phrase: mnemonic::to_string(&key),
        })),
        Err(rusqlite::Error::SqliteFailure(e, _)) if e.extended_code == 1555 => {
            error!("duplicate name while creating group");
            Err((StatusCode::CONFLICT, "name already exists".to_owned()))
        }
        Err(e) => {
            error!("error while creating goup {e:?}");
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                "internal error".to_owned(),
            ))
        }
    }
}

#[derive(Default, Deserialize)]
struct JoinGroupRequest {
    join_phrase: String,
}

// TODO: Currently internal server error on wrong code
// TODO: Proper response if user already in group
async fn join_group(
    State(state): State<ServerState>,
    claims: Claims,
    Json(req): Json<JoinGroupRequest>,
) -> Result<StatusCode, (StatusCode, String)> {
    let conn = get_conn(&state).await;

    let res = conn
        .interact(move |conn| -> Result<_, rusqlite::Error> {
            let id = conn.query_row(
                "select id from 'group' where join_phrase == $1",
                [req.join_phrase],
                |row| row.get::<_, i64>(0),
            )?;

            add_user_to_group(&conn, &claims.sub, id)?;

            Ok(())
        })
        .await
        .unwrap();

    match res {
        Ok(_) => Ok(StatusCode::OK),
        Err(e) => {
            error!("error while  joining group {e:?}");
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                "internal error".to_owned(),
            ))
        }
    }
}

fn add_user_to_group(conn: &Connection, user: &str, group: i64) -> Result<(), rusqlite::Error> {
    conn.execute(
        "insert into user_group (user, 'group') values (?1, ?2)",
        (user, group),
    )?;
    Ok(())
}
