import React from 'react';
import { Outlet, Link } from "react-router-dom";
import axios from 'axios';
import { useModal } from './context/modal-context';
import privacyIcon from './assets/img/privacy.svg';
import arrowIcon from './assets/img/arrow.svg';
import dashboardIcon from './assets/img/dashboard.svg';

function Layout({ user, onLogout }) {
  const { setModal } = useModal();

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-top">
            <Link to="/" className="logo"></Link>
            <nav className="main-nav" aria-label="Main Menu">
              <ul>
                <li>
                  <button
                    onClick={() => {
                      axios.get('../json/privacy-policy.json').then(res => {
                        const modalData = {
                          type: "default",
                          content: res.data[0]
                        };
                        setModal(modalData);
                      });
                    }}>Your Privacy
                    <img src={privacyIcon} alt="Privacy Icon" width="24" height="26" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      axios.get('../json/how-to-use-tool.json').then(res => {
                        const modalData = {
                          type: "default",
                          content: res.data[0]
                        };
                        setModal(modalData);
                      });
                    }}
                  >How to use this tool
                    <img src={arrowIcon} alt="Arrow Icon" width="21" height="23" />
                  </button>
                </li>
                {user && (
                  <li>
                    <Link to="/assessments">Assessment Dashboard
                      <img src={dashboardIcon} alt="Dashboard Icon" width="97" height="97" />
                    </Link>
                  </li>
                )}
                <li>
                  {user ? (
                    <span>{user.name} (<button class="logout" onClick={onLogout}>Logout</button>)</span>
                  ) : (
                    <a href="http://localhost:3080/auth/django">Login</a>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <div className="outer-container">
        <Outlet />
      </div>
    </>
  );
}

export default Layout;