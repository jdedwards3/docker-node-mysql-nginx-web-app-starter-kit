CREATE TABLE IF NOT EXISTS `app_user` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL UNIQUE KEY,
    `salt` CHAR(128) NOT NULL UNIQUE KEY,
    `hash` CHAR(128) NOT NULL UNIQUE KEY,
    `first_name` VARCHAR(255), 
    `last_name` VARCHAR(255),
    `forgot_password_salt` VARCHAR(128),
    `forgot_password_hash` VARCHAR(128),
    `forgot_password_token_end` INT UNSIGNED,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);