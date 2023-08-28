create table 'group' (
  id integer primary key,
  name text not null,
  avatar_hash text not null,
  join_phrase text not null,
  created_by text not null,
  created_at integer not null default (strftime('%s', 'now')),
  foreign key(created_by) references 'user'(name)
) strict;

create table user_group (
  'user' text not null,
  'group' integer not null,
  primary key('user', 'group'),
  foreign key('user') references 'user'(name),
  foreign key('group') references 'group'(id)
) strict, without rowid;

