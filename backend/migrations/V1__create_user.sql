create table user (
  name text primary key,
  display_name text not null,
  password_hash text not null,
  avatar_hash text not null
) strict, without rowid;
