use axum::{http::StatusCode, response::IntoResponse, routing::get, Router};
use deadpool_sqlite::{Config, Pool, Runtime};
use tower_http::{cors::CorsLayer, trace::TraceLayer};
use tracing::info;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

pub mod auth;
mod models;
mod routes;
pub mod util;

async fn health() -> impl IntoResponse {
    StatusCode::OK
}

#[derive(Clone)]
pub struct ServerState {
    pool: Pool,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "backend=debug,tower_http=debug,axum::rejection=trace".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let sqlite_path = std::env::var("SQLITE_PATH").unwrap_or("db.sqlite3".into());
    info!("SQLITE PATH: {}", sqlite_path);
    let cfg = Config::new(sqlite_path);
    let pool = cfg.create_pool(Runtime::Tokio1).unwrap();
    let state = ServerState { pool };

    let app = Router::new()
        .route("/health", get(health))
        .nest("/challenges", routes::challenge::routes())
        .nest("/users", routes::user::routes())
        .nest("/groups", routes::group::routes())
        .layer(TraceLayer::new_for_http())
        .layer(CorsLayer::very_permissive()) // TODO: Better CORS config
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
    axum::serve(listener, app).await.unwrap()
}
