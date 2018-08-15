drop table if exists shifts, weekdays, users;

create table users (
    id serial not null primary key,
    username varchar(20) not null,
    full_name varchar(20) not null,
    position varchar(10) not null default 'waiter'
);

create table weekdays (
    id serial not null primary key,
    day_name varchar(10) not null
);

create table shifts(
    id serial not null primary key, 
    user_id int not null,
    weekday_id int not null,
    foreign key (user_id) references users(id),
    foreign key (weekday_id) references weekdays(id)
);
