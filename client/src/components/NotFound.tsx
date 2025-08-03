import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div>
      <h1>404</h1>
      <p>this is not the webpage you are looking for</p>
      <Link to="/">Back to Home</Link>
    </div>
  );
};

export default NotFound;