pragma foreign_keys = 'ON';
create table if not exists topics(id integer primary key autoincrement,name text not null, description text , userId integer not null, start_time text not null, end_time text ,foreign key(userId) references registration(id));
create table if not exists comments(topic_id varchar, comment text, userId varchar not null, time varchar not null);
create table if not exists users(userId integer not null, action integer, foreign key(userId) references registration(id));
