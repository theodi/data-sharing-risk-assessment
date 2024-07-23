import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import Home from './Home';
import Assessments from './Assessments';
import Assessment from './Assessment';
import Login from './Login';
import Privacy from './Privacy';
import HowTo from './HowTo';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

// Set axios defaults
axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (token) {
      const decoded = jwtDecode(token.split('=')[1]);
      setUser(decoded);
    }
    axios.get('http://localhost:3080/auth/check')
      .then(response => {
        if (response.data) {
          setUser(response.data);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setUser(null); // Invalidate user state on error
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    axios.get('http://localhost:3080/auth/logout')
      .then(() => {
        setUser(null);
      })
      .catch(error => console.error('Error:', error));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="body">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout user={user} onLogout={handleLogout} />}>
            <Route index element={<Home />} />
            <Route
              path="assessments"
              element={user ? <Assessments /> : <Navigate to="/login" />}
            />
            <Route
              path="assessment/:id/checkpoint/:checkpointId"
              element={user ? <Assessment /> : <Navigate to="/login" />}
            />
            <Route
              path="assessment/:id/*"
              element={user ? <Assessment /> : <Navigate to="/login" />}
            />
            <Route
              path="privacy"
              element={<Privacy />}
            />
            <Route
              path="howto"
              element={<HowTo />}
            />
            <Route path="login" element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
