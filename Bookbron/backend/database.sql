CREATE DATABASE IF NOT EXISTS bookbron;
USE bookbron;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Test foydalanuvchi qo'shish (parol: test123)
INSERT INTO users (name, email, password) VALUES 
('Test User', 'test@example.com', '$2b$10$YourHashedPasswordHere'); 