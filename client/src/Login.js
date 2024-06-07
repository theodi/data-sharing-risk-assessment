// Login.js
import React from 'react';

const Login = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:3080/auth/django';
  };

  return (
    <div>
      <h2>Login required</h2>
      <p>Please login to create and view your assessments</p>
      <br/>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;