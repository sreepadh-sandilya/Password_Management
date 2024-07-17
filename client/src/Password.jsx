import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import './Password.css';
import axios from 'axios';
const Password = () => {
  const [password, setPassword] = useState('');
  const [passwordLength, setPasswordLength] = useState(12);
  const [useSymbols, setUseSymbols] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useLowerCase, setUseLowerCase] = useState(true);
  const [useUpperCase, setUseUpperCase] = useState(true);
  const [name, setName] = useState('');
  const [userpass,setUserpass]=useState([]);

  
  const navigate = useNavigate();

  const generatePassword = () => { 
    let charset = '';
    let newPassword = '';
    if (useSymbols) charset += '!@#$%^&*()';
    if (useNumbers) charset += '0123456789';
    if (useLowerCase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (useUpperCase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let i = 0; i < passwordLength; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    setPassword(newPassword);
  };
  const { id } = useParams();
  const handleSubmit = async(e) => {
    e.preventDefault();
    // Here you can handle form submission, e.g., send the data to the backend or perform any other action
    console.log('Submitted Name:', name);
    console.log('Generated Password:', password);
    try {
      
      const formData={name,password};
      const response = await axios.post('http://localhost:8800/password/'+id, formData);
      setUserpass([...userpass,formData]);
     
      console.log(response);
      // Check if response contains a valid token or user data indicating successful login
      if (response.status===200) { 
        alert("password added!");
      } else {
        console.error('Invalid');
        
      }
    } catch (error) {
      
      alert("invalid");
      // Optionally, display an error message to the user
    }

    // Redirect or navigate to another page if needed
    // navigate('/'); // Navigate to the home page
  };

  const fetchpasswords=async (e)=>{
    const response=await axios.get('http://localhost:8800/password/'+id);
    setUserpass(response.data)
    console.log(userpass)
  }


  
  
  const handleDelete = async(index) => {
    // Implement delete functionality here, e.g., remove the user from the userpass array
    console.log(index) 
    const response=await axios.delete('http://localhost:8800/password/'+index);
    setUserpass(userpass.filter(userpass=>userpass.id!==index));
    console.log('Delete user at index:', index);
  };

  const handleUpdate = (index) => {
    const updatedUserpass = [...userpass];
    updatedUserpass[index].isEditing = true; // Set editing flag for the item
    setUserpass(updatedUserpass);
  };

  const handleEditChange = (value, index, field) => {
    const updatedUserpass = [...userpass];
    updatedUserpass[index][field] = value;
    setUserpass(updatedUserpass);
  };
  
  const handleSave = async(index,ind) => {
    const updatedUserpass = [...userpass];
    updatedUserpass[index].isEditing = false; // Disable editing mode
    // Perform API call to update data on the server if needed
    setUserpass(updatedUserpass);
    // console.log(userpass)
    const data=userpass.filter(userpass=>userpass.id===ind)
    console.log(data)
    const response=await axios.put('http://localhost:8800/password/'+ind,data);
  };
  

  useEffect(() => {
    fetchpasswords();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="box">
      <h1>Random Password Generator</h1>
      <form onSubmit={handleSubmit}>
        <div className="inputContainer">
          <div className="number">
            <span>Password Length</span>
            <input type="number" min="8" max="32" value={passwordLength} onChange={(e) => setPasswordLength(e.target.value)} />
          </div>
          <div className="generate">
            <button type="button" onClick={generatePassword}>Generate Password</button>
          </div>
          <div className="checkboxcont">
            <input type="checkbox" checked={useSymbols} onChange={() => setUseSymbols(!useSymbols)} />Symbols
            <input type="checkbox" checked={useNumbers} onChange={() => setUseNumbers(!useNumbers)} />Numbers
            <input type="checkbox" checked={useLowerCase} onChange={() => setUseLowerCase(!useLowerCase)} />Lowercase
            <input type="checkbox" checked={useUpperCase} onChange={() => setUseUpperCase(!useUpperCase)} />Uppercase
          </div>
          <div className="input-name">
            <input type="text" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="passwordbox">
            <input type="text" value={password} readOnly />
          </div>
          <div className="submit-button">
            <button type="submit">Submit</button>
          </div>
        </div>
      </form>
      <div className="user-data">
  <h2>User Data</h2>
  <ul>
    {userpass.map((user, index) => (
      <li key={index} className="user-item">
        <div className="user-info">
          {user.isEditing ? ( // Render input fields if editing is enabled
            <>
              <input
                type="text"
                value={user.name}
                onChange={(e) => handleEditChange(e.target.value, index, 'name')}
              />
              <input
                type="text"
                value={user.password}
                onChange={(e) => handleEditChange(e.target.value, index, 'password')}
              />
            </>
          ) : (
            <>
              <strong>Name:</strong> {user.name}, <strong>Password:</strong> {user.password}
            </>
          )}
        </div>
        <div className="user-actions">
          {user.isEditing ? (
            <button className="update-btn" onClick={() => handleSave(index,user.id)}>Save</button>
          ) : (
            <button className="update-btn" onClick={() => handleUpdate(index)}>Update</button>
          )}
          <button className="delete-btn" onClick={() => handleDelete(user.id)}>Delete</button>
        </div>
      </li>
    ))}
  </ul>
</div>



    </div>
    
  );
};

export default Password;
