import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import HomePage from './home/HomePage.js';
import AboutPage from './about/AboutPage.js';
import PortalPage from './portal/PortalPage.js';
import DashboardPage from './dashboard/DashboardPage.js';


export default function App() {
    const [sessionData, setSessionData] = useState({});
    const [rendered, setRendered] = useState(false);
    const footerData = [{name: "Minesweeper", link: "#"}];
    const appTitle = "TestBot"
    
    const getSession = () => {
      const requestOptions = {
        method: "GET"
      }

      fetch('/webpage-api/handle-login', requestOptions)
        .then(response => response.json())
        .then(data => {
          setSessionData(data);
        });
    }

    useEffect(() => {
      setRendered(value => !value);
      getSession();
    }, []);

    return (
      <Router>
          <Switch>
            <Route exact path='/' render={() => (<HomePage links={footerData} appTitle={appTitle} />)} />
            <Route exact path='/about' render={() => (<AboutPage links={footerData} appTitle={appTitle} />)} />
            <Route exact path='/portal' render={() => {
              if (!rendered) return;
              return sessionData.user != undefined ?
                <Redirect to="/dashboard" /> :
                <PortalPage links={footerData} appTitle={appTitle} />
            }}
            />
            <Route path='/dashboard' render={() => {
              // if (!rendered) return;
              // return sessionData.user != undefined ?
              //   <DashboardPage links={footerData} appTitle={appTitle} /> :
              //   <Redirect to="/portal" />
              // }} 
              return <DashboardPage links={footerData} appTitle={appTitle} />}}
            />
          </Switch>
      </Router>
    );
}