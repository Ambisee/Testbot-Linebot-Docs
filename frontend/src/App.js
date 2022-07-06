import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import HomePage from './home/HomePage.js';
import AboutPage from './about/AboutPage.js';
import AuthRequired from './_auth/AuthRequired';
import PortalPage from './portal/PortalPage.js';
import DashboardPage from './dashboard/DashboardPage.js';
import { AuthContextProvider, useAuth } from './_auth/AuthContext.js';

function AppRouter() {
  const auth = useAuth();
  const appTitle = "TestBot";
  const footerData = [];

  return (
    <Router>
      <Routes>
        <Route
          exact
          path='/'
          element={<HomePage links={footerData} appTitle={appTitle} />}
        />
        <Route
          exact
          path='/about'
          element={<AboutPage links={footerData} appTitle={appTitle} />}
        />
        <Route
          exact
          path='/portal'
          element={(() => {
            if (auth.user === undefined) return <></>;
            return auth.user !== null ? 
              <Navigate to='/dashboard' /> :
              <PortalPage links={footerData} appTitle={appTitle} />
            })()
          }
        />
        <Route
          path='/dashboard'
          element={
            <AuthRequired login_route='/portal'>
              <DashboardPage links={footerData} appTitle={appTitle} />
            </AuthRequired>
          }
        />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthContextProvider>
      <AppRouter />
    </AuthContextProvider>
  )
}