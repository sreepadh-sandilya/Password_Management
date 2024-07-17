import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.css';

const Logins = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8800/login', formData);
      console.log('User logged in:', response);

      // Check if response contains a valid token or user data indicating successful login
      if (response.status===200) { 
        // Optionally, store user data or token in localStorage or a global state management solution

        // Navigate to '/' after successful login
        const id=response.data.user.id;
        console.log(response);
        navigate('/'+id);
      } else {
        console.error('Invalid credentials');
        // Optionally, display an error message to the user
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert("invalid credentials");
      // Optionally, display an error message to the user
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/">Sign up</Link></p>
    </div>
  ); 
};

export default Logins;
