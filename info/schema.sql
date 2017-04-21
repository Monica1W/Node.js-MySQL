
create database bamazon;

use bamazon;

create table products(
	item_id integer(10) auto_increment not null,
    product_name varchar(100) not null,
    department_name varchar(100) not null,
    price decimal (10,2) not null,
    stock_quantity integer(25) not null,
    primary key(item_id)
);
