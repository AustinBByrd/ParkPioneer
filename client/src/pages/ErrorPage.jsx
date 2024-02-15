import React from 'react';
import { Link } from 'react-router-dom';
import './ErrorPage.css';
import image from '../../../assets/404ErrorPark.jpeg';

function ErrorPage() {
  return (
    <div className="error-page-container">
      <h1>Oops! We can't find that page.</h1>
      <p>We're sorry, but the page you were looking for doesn't exist or has been moved.</p>
      <img src={image} alt="Lost In the Park" className="error-page-image" />
      <div className="error-page-actions">
        <Link to="/" className="btn btn-primary">Take Me Home</Link>
      </div>
    </div>
  );
}

export default ErrorPage;
