// src/pages/UserSignUp.jsx
import React from 'react';
import SignUpForm from '../components/SignUpForm'; 
import Navbar from '../components/Navbar'; 
function UserSignUp() {
  return (
    
    <div className="signup-container">
      <Navbar />
      <h2>User Sign-up</h2>
      <SignUpForm /> 
    </div>
  );
}

export default UserSignUp;
