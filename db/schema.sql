-- Drops the blogger if it exists currently --
DROP DATABASE IF EXISTS employee_tracker;
-- Creates the "blogger" database --
CREATE DATABASE employee_tracker;

USE employee_tracker;

CREATE TABLE department ( 
    id INT AUTO_INCREMENT PRIMARY KEY,
    name varchar(30)

);

CREATE TABLE role ( 
    id INT AUTO_INCREMENT PRIMARY KEY,
    title varchar(30),
    salary decimal,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department (id)
);



CREATE TABLE employee ( 
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name varchar(30),
    last_name varchar(30),
	manager_id INT,
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES role (id),
    FOREIGN KEY (manager_id) REFERENCES employee (id)
);
