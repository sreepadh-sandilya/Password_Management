const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser'); // Middleware for handling request bodies
const db = require('./config/db'); // Connection to database
const port = 8800; // Port number for the server to listen on

const app = express();

// Middleware setup
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(bodyParser.urlencoded({ extended: false })); // Parse URL-encoded request bodies

// Your route handlers and other configurations go here

app.post('/signup', (req, res) => {
    const q = `
      INSERT INTO users (name, email, password)
      SELECT ?, ?, ?
      WHERE NOT EXISTS (
        SELECT 1 FROM users WHERE email = ?
      )
    `;
    const values = [req.body.name, req.body.email, req.body.password, req.body.email];
    db.query(q, values, (err, data) => {
      if (err) {
        return res.json(err);
      } else {
        if (data.affectedRows > 0) {
          return res.status(200).json('User is created');
        } else {
          return res.status(409).json({ error: 'Email already exists' });
        }
      }
    });
  });

app.post('/login',(req,res)=>{
    const q='select * from users where email=? and password=?'
    const values=[req.body.email,req.body.password]
    db.query(q,values,(err,data)=>{
        if(err)
        {
            return res.json(err);
        }
        else{
            if(data.length>0)
            {
                return res.status(200).json({ message: 'Login successful', user: data[0] });
            } 
            else {
                // User not found or incorrect credentials, send an error response
                return res.status(401).json({ error: 'Invalid email or password' });
              }
        }

    })
})
 
app.post(`/password/:id`, (req, res) => {
    const { id } = req.params; // Extracting the user ID from the URL parameter
  
    const { name, password } = req.body; // Getting name and password from the request body
  
    const q = `INSERT INTO passwords (user_id, name, password) VALUES (?, ?, ?)`;
    const values = [id, name, password];
  
    db.query(q, values, (err, result) => {
      if (err) {
        console.error('Error inserting data into passwords table:', err);
        res.status(500).json({ error: 'Error inserting data into passwords table' });
      } else {
        console.log('Data inserted into passwords table');
        res.status(200).json({ message: 'Data inserted into passwords table' });
      }
    });
  });

  app.get(`/password/:id`, (req, res) => {
    const { id } = req.params; // Extracting the user ID from the URL parameter
  
    
  
    const q = `SELECT * FROM passwords WHERE user_id=?`;
    const values = [id];
  
    db.query(q, values, (err, data) => {
      if (err) {
        console.error('Error in selecting:', err);
        return res.status(500).json({ error: 'Error in selecting' });
      } else {
        console.log('selected');
        return res.status(200).json(data);
      }
    });
  });

  app.delete(`/password/:id`, (req, res) => {
    const { id } = req.params; // Extracting the user ID from the URL parameter
  
    
  
    const q = `DELETE FROM passwords WHERE id=?`;
    const values = [id];
  
    db.query(q, values, (err, data) => {
      if (err) {
        console.error('Error in selecting:', err);
        return res.status(500).json({ error: 'Error in selecting' });
      } else {
        console.log('selected');
        return res.status(200).json(data);
      }
    });
  });
  
  app.put(`/password/:id`, (req, res) => {
    const { id } = req.params; // Extracting the user ID from the URL parameter

  
    const q = `UPDATE passwords SET name=?,password=? WHERE id=?`;
    const values = [req.body[0].name,req.body[0].password,id];
  
    db.query(q, values, (err, data) => {
      if (err) {
        console.error('Error in selecting:', err);
        console.log("id:",id)
        console.log(req.body[0]);
        // console.log(res);
        return res.status(500).json({ error: 'Error in selecting' });

      } else {
        console.log('selected');
        return res.status(200).json(data);
      }
    });
  });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
