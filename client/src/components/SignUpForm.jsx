// src/components/SignUpForm.jsx
import React, { useState } from 'react';
import './SignUpForm.css'; 
import axios from 'axios';

function SignUpForm() {
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState('');



  const validate = () => {
      let errors = {};
      if (!formData.name) errors.name = "Name is required.";
      if (!formData.email) {
          errors.email = "Email is required.";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          errors.email = "Email is invalid.";
      }
      if (!formData.password) {
          errors.password = "Password is required.";
      } else if (formData.password.length < 8) {
          errors.password = "Password must be at least 8 characters long.";
      }
      return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length === 0) {
        const submitData = {
            ...formData,
            username: formData.name, 
        };
        delete submitData.name;
  
        try {
            const response = await axios.post('http://127.0.0.1:5555/api/signup', submitData);
            setSuccessMessage('User created successfully.');
            setFormErrors({});
            setServerError('');
            
        } catch (error) {
            setServerError(error.response.data.message); 
            setSuccessMessage(''); 
        }
    } else {
        setFormErrors(errors);
    }
  };
  



  const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevFormData => ({
          ...prevFormData,
          [name]: value,
      }));
  };

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
        {formErrors.name && <p style={{ color: 'red' }}>{formErrors.name}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
        {formErrors.email && <p style={{ color: 'red' }}>{formErrors.email}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
        {formErrors.password && <p style={{ color: 'red' }}>{formErrors.password}</p>}
      </div>

      {successMessage && <p style={{ color: 'green', textAlign: 'center' }}>{successMessage}</p>}
  
      
      {serverError && <p style={{ color: 'red', textAlign: 'center' }}>{serverError}</p>}
  
      <button type="submit" className="submit-btn">Sign Up</button>
    </form>
  );
  
}

export default SignUpForm;
