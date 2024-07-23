// src/Login.js
import React from 'react';

const Login = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleLogin = () => {
    window.location.href = `${apiUrl}/auth/django`;
  };

  return (
    <div className="template template-home">
      <div className="container">
        <div className="template-inner">
          <h1 className="template-title">Login Required</h1>
          <div className="template-left">
            <p>Please login to create and view your assessments</p>
            <br/>
            <button onClick={handleLogin}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;