import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import './Navbar.css';
import logo from '../../../assets/Icon.png';

function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);

  
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    setIsLoggedIn(!!userId);
    setUserId(userId);
    
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    alert('Search functionality will be implemented soon!'); 
    setSearchQuery(''); 
  };

  const handleLogout = () => {

    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    navigate('/'); 
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src={logo} alt="Park Pioneer Logo" className="navbar-logo" />
        <span className="navbar-title">Park Pioneer</span>
      </div>
      <ul className="navbar-nav">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/EventsCalendar">Events</Link>
        </li>
        {isLoggedIn && (
          <li>
            <Link to={`/user-profile/${userId}`}>My Profile</Link>
          </li>
        )}
        {isLoggedIn ? (
          <li>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </li>
        ) : (
          <>
            <li>
              <Link to="/LoginPage">Login</Link>
            </li>
            <li>
              <Link to="/UserSignUp">Sign Up</Link>
            </li>
          </>
        )}
      </ul>
     
    </nav>
  );
}

export default Navbar;
