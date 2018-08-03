DELETE FROM shifts, users, weekdays;
-- insert test table data

-- User data
INSERT INTO users (username, full_name, position) VALUES ('deelowtrayne', 'Luvuyo Sono', 'Admin');
INSERT INTO users (username, full_name, position) VALUES ('mishy', 'Amanda Gxagxa', 'Waiter');
INSERT INTO users (username, full_name, position) VALUES ('avis', 'Aviwe Mbekeni', 'Waiter');
INSERT INTO users (username, full_name, position) VALUES ('mrbooi', 'Ayabonga Booi', 'Waiter');

-- Weekdays data
INSERT INTO weekdays (day_name) VALUES ('Monday');
INSERT INTO weekdays (day_name) VALUES ('Tuesday');
INSERT INTO weekdays (day_name) VALUES ('Wednesday');
INSERT INTO weekdays (day_name) VALUES ('Thursday');
INSERT INTO weekdays (day_name) VALUES ('Friday');
INSERT INTO weekdays (day_name) VALUES ('Saturday');
INSERT INTO weekdays (day_name) VALUES ('Sunday');

-- WorkShifts data


select * from users;
select * from weekdays;
select * from shifts;