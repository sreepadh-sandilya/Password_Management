
const mysql = require('mysql');
const db=mysql.createConnection({
    host:"localhost",
    password:"sree@2003",
    user:"root",
    database:"password",
    multipleStatements: true
})

db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(20) NOT NULL,
    PRIMARY KEY (id)
  )`, (err) => {
    if (err) {
      console.error('Error creating database:', err);
      // Handle the error gracefully, e.g., return an error response
    } else {
      console.log('Database created');
      // Proceed with other operations
    }
    console.log('users table created');
  });


  db.query(`
  CREATE TABLE IF NOT EXISTS passwords (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(20) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`, (err) => {
    if (err) {
      console.error('Error creating database:', err);
      // Handle the error gracefully, e.g., return an error response
    } else {
      console.log('Database created');
      // Proceed with other operations
    }
    console.log('passwords table created');
  });

  module.exports = db;