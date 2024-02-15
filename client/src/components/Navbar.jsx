import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import logo from '../../../assets/Icon.png';
import './Navbar.css'; // Import your custom CSS if needed


function CustomNavbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    setIsLoggedIn(!!userId);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src={logo} alt="Park Pioneer Logo" className="navbar-logo" />
          Park Pioneer
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/EventsCalendar">Events</Nav.Link>
            {isLoggedIn ? (
              <>
                <Nav.Link as={Link} to={`/user-profile/${localStorage.getItem('userId')}`}>My Profile</Nav.Link>
                <Button onClick={handleLogout} variant="outline-danger">Logout</Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/LoginPage">Login</Nav.Link>
                <Nav.Link as={Link} to="/UserSignUp">Sign Up</Nav.Link>
              </>
            )}
          </Nav>
          {/* Implement search functionality here */}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
