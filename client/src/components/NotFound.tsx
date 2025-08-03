import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div style={{ 
      padding: '50px 20px', 
      textAlign: 'center',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h1 style={{ fontSize: '4em', color: '#333', marginBottom: '20px' }}>404</h1>
      <h2 style={{ color: '#666', marginBottom: '30px' }}>
        this is not the webpage you are looking for
      </h2>
      
      <Link 
        to="/" 
        style={{ 
          color: '#007bff', 
          textDecoration: 'none',
          fontSize: '1.2em',
          padding: '10px 20px',
          border: '2px solid #007bff',
          borderRadius: '5px',
          display: 'inline-block'
        }}
      >
        Go back to Home
      </Link>
    </div>
  );
};

export default NotFound;