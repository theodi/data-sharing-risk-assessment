import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import Assessments from './Assessments';
import Assessment from './Assessment';
import Login from './Login';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3080/auth/check', { withCredentials: true })
      .then(response => {
        console.log(response.data);
        if (response.data) {
          setUser(response.data);
        }
      })
      .catch(error => console.error('Error:', error));
  }, []);

  const handleLogout = () => {
    axios.get('http://localhost:3080/auth/logout', {}, { withCredentials: true })
      .then(() => {
        setUser(null);
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <div className="body">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout user={user} onLogout={handleLogout} />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route
              path="assessments"
              element={user ? <Assessments /> : <Navigate to="/login" />}
            />
            <Route
              path="assessment"
              element={user ? <Assessment /> : <Navigate to="/login" />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;