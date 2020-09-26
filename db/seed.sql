use employee_tracker;
INSERT INTO department
    (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');
INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Sales Lead', 100000, 1),
    ('Salesperson', 80000, 1),
    ('Lead Engineer', 150000, 2),
    ('Software Engineer', 120000, 2),
    ('Account Manager', 160000, 3),
    ('Accountant', 125000, 3),
    ('Legal Team Lead', 250000, 4),
    ('Lawyer', 190000, 4);
INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Amanda', 'Mahon', 1, NULL),
    ('Harry', 'Styles', 2, 1),
    ('Allison', 'Fitzgerald', 3, NULL),
    ('Martin', 'Klunder', 4, 3),
    ('Morgan', 'Vaughan', 5, NULL),
    ('Peyton', 'Allison', 6, 5),
    ('Emily', 'Burke', 7, NULL),
    ('Timmy', 'Chalamet', 8, 7);