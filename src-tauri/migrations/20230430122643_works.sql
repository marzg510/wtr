-- Add migration script here
create table works (
  id integer not null primary key,
  work_date date not null,
  start_time datetime not null,
  end_time datetime not null,
  work nvarchar(1000) not null,
  project_id integer,
  task nvarchar(1000)
)