CREATE DATABASE user_db; -- create a database userdb;
use user_db;
CREATE TABLE users (
	id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE
);

SELECT id, name, email
from users