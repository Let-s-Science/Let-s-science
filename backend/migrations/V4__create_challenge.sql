create table challenge (
  id integer primary key,
  hidden integer not null default 0,
  name text not null,
  description text not null,
  reward integer not null,
  required_amount integer not null,
  created_at integer not null default (strftime('%s', 'now'))
) strict;

create table challenge_tag (
  challenge integer not null,
  tag text not null,
  primary key (challenge, tag)
) strict;

create index indx_challenge_tag_challenge on challenge_tag (challenge);

create table user_challenge (
  challenge integer not null,
  'user' text not null,
  created_at integer not null default (strftime('%s', 'now')),
  foreign key('user') references 'user'(name),
  foreign key('challenge') references challenge(id)
) strict;

create index indx_user_challenge_user on user_challenge ('user');
