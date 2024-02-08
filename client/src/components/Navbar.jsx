// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import './Navbar.css';
import logo from '../../../assets/Icon.png';


function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');

  // Dummy handler for now
  const handleSearch = (e) => {
    e.preventDefault();
    alert('Search functionality will be implemented soon!'); 
    setSearchQuery(''); 
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
        <li>
          <Link to="/LoginPage">Login</Link>
        </li>
        <li>
          <Link to="/UserSignUp">Sign Up</Link>
        </li>
        <li>
          <Link to="/AdminConsole">Admin Console</Link>
        </li>
      </ul>
      <form onSubmit={handleSearch} className="navbar-search">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
    </nav>
  );
}

export default Navbar;
