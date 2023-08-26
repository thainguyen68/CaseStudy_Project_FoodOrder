create database shop_food;
use shop_food;
create table roles(
id bigint primary key auto_increment,
name varchar(255));

create table users(
id bigint primary key auto_increment,
email varchar(255),
username varchar(255),
password varchar(255),
phone varchar(10),
birthday datetime,
gender varchar(5),
address varchar(255),
status_user varchar (10)
);


create table users_roles(
roles_id bigint,
users_id bigint,
foreign key (roles_id) references roles(id),
foreign key (users_id) references users(id) );


create table city(
id bigint primary key auto_increment,
name varchar(255));

create table shops(
id bigint primary key auto_increment,
name varchar(255),
description varchar(255),
phone varchar(10),
start_time time,
end_time time,
email varchar(255),
users_id bigint,
city_id bigint,
foreign key (users_id) references users(id),
foreign key (city_id) references city(id),
status_shop varchar(10)
);

create table voucher(
id bigint primary key auto_increment,
name varchar(255),
percent double,
quantity bigint,
shops_id bigint,
foreign key (shops_id) references shops(id),
status_voucher varchar(10));

create table shippers(
id bigint primary key auto_increment,
name varchar(255),
phone varchar(10),
percent double,
status varchar(10),
status_shipper varchar(10));


create table shop_shipper(
shops_id bigint,
shippers_id bigint,
foreign key (shops_id) references shops(id),
foreign key (shippers_id) references shippers(id) );


create table category(
id bigint primary key auto_increment,
name varchar(255));

create table products(
id bigint primary key auto_increment,
name varchar(255),
description varchar(255),
quantity bigint,
price double,
image varchar(255),
views bigint,
status varchar(10),
shops_id bigint,
category_id bigint,
foreign key (shops_id) references shops(id)
 );
 create table products_category(
products_id bigint,
category_id bigint,
foreign key (products_id) references products(id),
foreign key (category_id) references category(id) );



create table carts(
id bigint primary key auto_increment,
users_id bigint,
foreign key (users_id) references users(id));

create table products_carts(
quantity bigint,
products_id bigint,
carts_id bigint,
foreign key (products_id) references products(id),
foreign key (carts_id) references carts(id) );


create table bills(
id bigint primary key auto_increment,
date datetime,
status varchar(10),
shops_id bigint,
users_id bigint,
foreign key (shops_id) references shops(id),
foreign key (users_id) references users(id),
status_bills varchar(10) );

create table bills_detail(
quantity bigint,
total double,
products_id bigint,
bills_id bigint,
foreign key (products_id) references products(id),
foreign key (bills_id) references bills(id) );














