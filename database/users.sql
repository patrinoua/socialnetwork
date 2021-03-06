DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS friendships;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first VARCHAR(250) NOT NULL,
    last VARCHAR(250) NOT NULL,
    email VARCHAR(250) NOT NULL UNIQUE,
    pass VARCHAR(250) NOT NULL,
    profilepic VARCHAR(250),
    bio VARCHAR(1250),
    sex VARCHAR(50)
);
