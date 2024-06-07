import pool from "../config/db.js";

const createModels = async () => {
    try {
        await pool.query(`
            CREATE TABLE users (
              id SERIAL PRIMARY KEY,
              login VARCHAR(255) UNIQUE NOT NULL,
              password VARCHAR(255) NOT NULL,
              otp VARCHAR(6),
              otp_expires TIMESTAMP,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
          
          CREATE TABLE files (
              id SERIAL PRIMARY KEY,
              filename VARCHAR(255) NOT NULL,
              filepath VARCHAR(255) NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
          
          CREATE TABLE courses (
              id SERIAL PRIMARY KEY,
              title VARCHAR(255) NOT NULL,
              description TEXT NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
          
          CREATE TABLE user_courses (
              id SERIAL PRIMARY KEY,
              user_id INTEGER REFERENCES users(id),
              course_id INTEGER REFERENCES courses(id),
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
          
          CREATE TABLE course_files (
              id SERIAL PRIMARY KEY,
              course_id INTEGER REFERENCES courses(id),
              file_id INTEGER REFERENCES files(id),
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );  
          `)
          console.log("created models")
    } catch (err) {
        console.log("Tables already exist, OK")
    }
}

export default createModels;