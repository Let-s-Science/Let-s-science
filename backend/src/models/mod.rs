use secrecy::SecretString;
use serde::{Deserialize, Serialize};
use time::OffsetDateTime;

use crate::auth::Permission;

#[derive(Debug, Serialize, Deserialize)]
pub struct Group {
    pub id: i64,
    pub name: String,
    pub avatar_hash: String,
    pub join_phrase: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Challenge {
    pub id: i64,
    pub hidden: bool,
    pub name: String,
    pub description: String,
    pub reward: i64,
    pub required_amount: i64,
    pub tags: Vec<String>,
    #[serde(with = "time::serde::iso8601")]
    pub created_at: OffsetDateTime,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserChallenge {
    pub challenge: i64,
    pub user: String,
    #[serde(with = "time::serde::iso8601")]
    pub created_at: OffsetDateTime,
}

#[derive(Debug, Deserialize)]
pub struct User {
    pub name: String,
    pub display_name: String,
    pub avatar_hash: String,
    pub password_hash: SecretString,
    pub permissions: Vec<Permission>,
}
