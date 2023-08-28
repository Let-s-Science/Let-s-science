create table user_permission (
  'user' text not null,
  permission text not null,
  primary key ('user', permission),
  foreign key('user') references 'user'(name)
) strict, without rowid;

create index indx_user_permission_user on user_permission ('user');
