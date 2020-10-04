-- Drops the blogger if it exists currently --
DROP DATABASE IF EXISTS employee_tracker;
-- Creates the "blogger" database --
CREATE DATABASE employee_tracker;

USE employee_tracker;

CREATE TABLE departments ( 
    id INT AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)

);

CREATE TABLE roles ( 
    id INT AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY (id)
    FOREIGN KEY (department_id) REFERENCES departments (id)
);



CREATE TABLE employees ( 
    id INT AUTO_INCREMENT,
    first_name varchar(30) NOT NULL,
    last_name varchar(30) NOT NULL,
	manager_id INT,
    role_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES roles (id),
    FOREIGN KEY (manager_id) REFERENCES employees (id)
);
