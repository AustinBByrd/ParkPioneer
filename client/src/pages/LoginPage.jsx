import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar'; 
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [formData, setFormData] = useState({
    login: '', 
    password: '',
  });

  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:5555/api/login', {
        email: formData.login, 
        password: formData.password,
      });
      console.log('Login successful:', response.data);
      navigate('/');
      
      setLoginError('');
    } catch (error) {
      console.error('Login error:', error.response?.data?.error || 'An error occurred');
      setLoginError(error.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container" style={{ maxWidth: '300px', margin: 'auto', marginTop: '20px' }}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login">Username or Email</label>
            <input
              type="text"
              id="login"
              name="login"
              value={formData.login}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {loginError && <div style={{ color: 'red', marginTop: '10px' }}>{loginError}</div>}
          <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>Login</button>
        </form>
      </div>
    </>
  );
}

export default LoginPage;
