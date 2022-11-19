CREATE EXTENSION CITEXT;
CREATE EXTENSION pgcrypto;
CREATE TABLE "user" (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password TEXT,
    email CITEXT NOT NULL UNIQUE,
    profile_picture VARCHAR(255) DEFAULT 'http://127.0.0.1:5000/public\profilePicture\default.png'
);


CREATE TABLE user_token (
    user_id INT UNIQUE,
    refresh_token TEXT,
    CONSTRAINT fk_user_token
        FOREIGN KEY(user_id)
            REFERENCES "user"(user_id)
);

DROP TABLE user_token;
DROP TABLE "user";
