use axum::http::StatusCode;
use deadpool_sqlite::Object;
use tracing::error;

use crate::ServerState;

pub(crate) fn internal_error<E>(err: E) -> (StatusCode, String)
where
    E: std::error::Error,
{
    error!("{:?}", err);
    (StatusCode::INTERNAL_SERVER_ERROR, err.to_string())
}

pub(crate) async fn get_conn(state: &ServerState) -> Object {
    state.pool.get().await.unwrap()
}
