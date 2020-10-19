import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  BrowserRouter
} from "react-router-dom";

import RegisterScreen from '../src/pages/registerScreen.jsx';
import LoginScreen from '../src/pages/loginScreen.jsx';
import HomeScreen from '../src/pages/homeSreen.jsx';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Route path='/' exact={true} component={HomeScreen}></Route>

      <Route path='/register' component={RegisterScreen}></Route>
      <Route path='/login' component={LoginScreen}></Route>
      </BrowserRouter>
    </div>
  );
}

export default App;
