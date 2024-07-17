import logo from './logo.svg';
import './App.css';
import Password from './Password'
import Logins from './Logins'; // Corrected import statement

import Signup from './Signup';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
   
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Signup/>} />
        <Route path='/:id' element={<Password/>} />
        <Route path='/login' element={<Logins/>} />
      </Routes> 
    </Router>
  );
}

export default App;
