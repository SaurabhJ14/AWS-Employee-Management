CREATE DATABASE employeedb;

USE employeedb;

CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO employees (name, email, department)
VALUES
('Rahul Sharma', 'rahul@example.com', 'Engineering'),
('Priya Verma', 'priya@example.com', 'Human Resources'),
('Amit Kumar', 'amit@example.com', 'Finance');
