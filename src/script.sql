DROP DATABASE IF EXISTS formly;

CREATE DATABASE formly;

USE formly;

drop DATABASE formly;

select * FROM users;

drop database formly;

select id, name, username, role FROM users;

CREATE TABLE users(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user' NOT NULL
);

CREATE TABLE forms(
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    accessCode CHAR(6) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active' NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE question(
    id INT PRIMARY KEY AUTO_INCREMENT,
    indexx INT NOT NULL,
    question VARCHAR(255) NOT NULL,
    points INT NOT NULL,
    idForm INT NOT NULL,
    type ENUM('text', 'textarea', 'radio', 'checkbox') NOT NULL,
    CONSTRAINT fk_form FOREIGN KEY (idForm) REFERENCES forms(id) ON DELETE CASCADE
);

CREATE TABLE options(
    id INT PRIMARY KEY AUTO_INCREMENT,
    question_id INT NOT NULL,
    option_value VARCHAR(255) NOT NULL,
    isTrue BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (question_id) REFERENCES question(id) ON DELETE CASCADE
);

CREATE TABLE form_answers(
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    form_id INT NOT NULL,
    user_id INT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

drop table form_answers;

CREATE TABLE answers(
    id INT PRIMARY KEY AUTO_INCREMENT,
    form_answer_id INT NOT NULL,
    question_id INT NOT NULL,
    option_id INT NULL,
    answer_text TEXT NULL,
    FOREIGN KEY (form_answer_id) REFERENCES form_answers(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES question(id) ON DELETE CASCADE,
    FOREIGN KEY (option_id) REFERENCES options(id) ON DELETE CASCADE
);







SHOW TABLES;