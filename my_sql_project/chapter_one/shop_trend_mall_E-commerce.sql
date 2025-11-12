CREATE DATABASE shop_trend_mall; -- creating a database
use shop_trend_mall;
CREATE TABLE customers (
	id INT PRIMARY KEY,
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    address VARCHAR(100)
);
use shop_trend_mall;
CREATE TABLE products (
	id INT PRIMARY KEY,
    item VARCHAR(100),
    quantity INT,
    price DECIMAL(10,2)
);
use shop_trend_mall;
CREATE TABLE orders (
	id INT PRIMARY KEY,
    customersFullname VARCHAR(15),
    customersAddress VARCHAR(50),
    item VARCHAR(15),
    quantityOrdered INT,
    amountDelivered INT    
);


