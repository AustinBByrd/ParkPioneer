import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';

function LoginPage() {
  const { setUser } = useUserContext();
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
      const response = await axios.post('http://localhost:5555/api/login', formData);
      console.log('Login successful:', response.data);

      // Set the user context with the returned user data
      setUser({
        id: response.data.userId,
        // include other user data you might need
      });

      // Save the user ID in local storage or session storage
      localStorage.setItem('userId', response.data.userId);

      // Navigate to user profile page
      navigate(`/user-profile/${response.data.userId}`);
    } catch (error) {
      console.error('Login error:', error);

      if (error.response) {
        if (error.response.status === 401) {
          setLoginError('Incorrect email or password.');
        } else if (error.response.status === 404) {
          navigate('/UserSignUp');
        } else {
          setLoginError('An error occurred. Please try again.');
        }
      } else {
        setLoginError('No response from the server. Please try again.');
      }
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
