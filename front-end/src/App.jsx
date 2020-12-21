import React, { Component } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  BrowserRouter,
} from "react-router-dom";

import RegisterScreen from "../src/pages/registerScreen.jsx";
import LoginScreen from "../src/pages/loginScreen.jsx";
import HomeScreen from "../src/pages/homeSreen.jsx";
import ProfileScreen from "../src/pages/profileScreen.jsx";
import VerifyScreen from "../src/pages/verifyScreen.jsx";
class App extends Component {
  state= {};
  
  render() {
    return (
      <div className="App">
      <BrowserRouter>
        <Route path="/" exact={true} component={HomeScreen}></Route>
        <Route path="/register" component={RegisterScreen}></Route>
        <Route path="/login" component={LoginScreen}></Route>
        <Route path="/profile/:id" component={ProfileScreen}></Route>
        <Route path="/verify/:id" component={VerifyScreen}></Route>
      </BrowserRouter>
    </div>
    );
  }
}

export default App;

// function App() {
//   fetch("http://localhost:3001/api/users/get-current-user", {
//     method: "GET",
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then((res) => {
//       return res.json();
//     })
//     .then((data) => {
//       console.log(data);
//       if(data.success == false){
//         window.location.href='/login'
//       } else{
//       }
//     })
//     .catch((error) => {
//       this.setState({
//         errMessage: error.message,
//       });
//     });
//   return (
//     <div className="App">
//       <BrowserRouter>
//         <Route path="/" exact={true} component={HomeScreen}></Route>

//         <Route path="/register" component={RegisterScreen}></Route>
//         <Route path="/login" component={LoginScreen}></Route>
//       </BrowserRouter>
//     </div>
//   );
// }

// export default App;
