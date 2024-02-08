// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './Navbar.css';
import logo from '../../../assets/Icon.png';


function Navbar() {
  const [searchQuery, setSearchQuery] = useState(''); // State to hold the search query

  // Dummy handler for now
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    alert('Search functionality will be implemented soon!'); // Placeholder action
    setSearchQuery(''); // Optional: clear the search input
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
      {/* Search form */}
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
