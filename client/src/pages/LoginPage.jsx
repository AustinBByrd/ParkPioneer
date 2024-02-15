import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';

function LoginPage() {
  const { setUser } = useUserContext();
  const [formData, setFormData] = useState({ login: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5555/api/login', formData);
      setUser({ id: response.data.userId });
      localStorage.setItem('userId', response.data.userId);
      navigate(`/user-profile/${response.data.userId}`);
    } catch (error) {
      const message = error.response ? error.response.data.error : 'No response from the server. Please try again.';
      setLoginError(message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title text-center">Login</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="login">Username or Email</label>
                    <input type="text" id="login" name="login" className="form-control" value={formData.login} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
                  </div>
                  {loginError && <div className="alert alert-danger mt-2">{loginError}</div>}
                  <button type="submit" className="btn btn-primary mt-3 w-100">Login</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
