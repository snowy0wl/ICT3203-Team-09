import React, { useState, useEffect } from 'react'
import './App.css';
import Navbar from './components/Navbar';
import { HashRouter ,BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/pages/HomePage/Home';
import SignUp from './components/pages/SignUp/SignUp';
import Login from './components/pages/Login/Login';
import Banking from './components/pages/Banking/Banking';
import Account from './components/pages/Account/Account';
import ResetPw from './components/pages/ResetPw/ResetPw';


function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  function setLogin() {
    setIsLoggedIn(true)
  }

  function setLogout() {
    setIsLoggedIn(false)
  }

  return (
    <HashRouter>
      <Navbar isLoggedIn={isLoggedIn} setLogout={setLogout}/>
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/home' exact component={Home} />
        <Route path='/sign-up' component={SignUp} />
        <Route path='/login' render={() => (<Login setLogin={setLogin}/>)}/>
        <Route path='/banking' component={Banking} />
        <Route path='/account' component={Account} />
        <Route path='/resetpw' component={ResetPw} />
      </Switch>
    </HashRouter>
    
  );
}

export default App;
