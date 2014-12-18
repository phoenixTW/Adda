create table if not exists topics(id integer primary key autoincrement,name text not null, description text , userId integer not null, start_time text not null, end_time text ,foreign key(userId) references registration(id));
create table if not exists comments(topic_id integer primary key autoincrement not null, comment text, userId integer not null, time varchar not null, foreign key(topic_id) references topics(id),foreign key(userId) references registration(id));
create table if not exists users(userId integer not null, action integer, foreign key(userId) references registration(id));