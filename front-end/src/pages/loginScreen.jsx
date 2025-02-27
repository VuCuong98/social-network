import React, { Component } from "react";

class loginScreen extends Component {
  state = {
    email: "",
    password: "",
    errMessage: "",
    loading: false,
  };
  handleClose = {};

  handleEmailChange = (event) => {
    this.setState({
      email: event.target.value,
    });
  };

  handlePasswordChange = (event) => {
    this.setState({
      password: event.target.value,
    });
  };

  handleFormSubmit = (event) => {
    event.preventDefault();
    fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
        errMessage: this.state.errMessage,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (!data.success) {
          this.setState({
            errMessage: data.message,
          });
        } else {
          this.setState({
            loading: true,
          });
          console.log(data);
          // save current user to localStorage
          window.localStorage.setItem("email", data.data.email);
          window.localStorage.setItem("fullName", data.data.fullName);
          window.localStorage.setItem("id", data.data._id)
          // redirect user
          window.location.href = "/";

          console.log("Login Success !");
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          errMessage: error.message,
        });
      });
  };
  render() {
    return (
      <div className="login">
        <h1 className="title--h1">Sign in</h1>
        <form className="login-form" onSubmit={this.handleFormSubmit}>
          <div className="input-box">
            <i class="fas fa-envelope"></i>
            <input
              type="text"
              placeholder="Email"
              onChange={this.handleEmailChange}
              value={this.state.email}
            />
          </div>
          <div className="input-box">
            <i class="fas fa-lock"></i>
            <input
              type="password"
              placeholder="Password"
              onChange={this.handlePasswordChange}
              value={this.state.password}
            />
          </div>
          {this.state.errMessage ? (
            <span className="error-noti">{this.state.errMessage}</span>
          ) : null}

          <button type="submit" className="btn btn--signin">
            SIGN IN
          </button>
          <div className="move-page">
            <span>Don't have an account?</span>
            <a href="/register">SIGN UP NOW</a>
          </div>
        </form>
      </div>
    );
  }
}

export default loginScreen;
