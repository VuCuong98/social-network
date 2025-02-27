import React, { Component } from "react";

class registerScreen extends Component {
  state = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    errMessage: "",
    data: {},
  };
  componentDidMount() {}

  ///////////
  handleFullNameChange = (event) => {
    this.setState({
      fullName: event.target.value,
    });
  };

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

  handleConfirmPasswordChange = (event) => {
    this.setState({
      confirmPassword: event.target.value,
    });
  };

  handleFormSubmit = (event) => {
    event.preventDefault();
    fetch("http://localhost:3001/api/auth/register", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json, text/plain",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: this.state.fullName,
        email: this.state.email,
        password: this.state.password,
        confirmPassword: this.state.confirmPassword,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (!data.success) {
          this.setState({
            errMessage: data.message,
          });
        } else {
          console.log(data);
          this.setState({
            data: data,
          });
        }
      })
      .catch((err) => {
        this.setState({
          errMessage: err.message,
        });
      });
  };
  handleMoveToLoginPage = () => {
    window.location.href = '/login'
  }
  render() {
    return (
      <div className="register">
        <h1 className="title--h1">Sign up</h1>
        <form onSubmit={this.handleFormSubmit} className="register-form">
          <div className="input-box">
            <i class="fas fa-user"></i>
            <input
              type="text"
              placeholder="Username"
              onChange={this.handleFullNameChange}
              value={this.state.fullName}
            />
          </div>
          <div className="input-box">
            <i class="fas fa-envelope"></i>
            <input
              type="text"
              placeholder="E-mail"
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
          <div className="input-box">
            <i class="fas fa-lock"></i>
            <input
              type="password"
              placeholder="Re-password"
              onChange={this.handleConfirmPasswordChange}
              value={this.state.confirmPassword}
            />
          </div>
          {this.state.errMessage ? (
            <span className="form-err">{this.state.errMessage}</span>
          ) : null}
          
          <button type="submit" className="btn btn--signup">
            SIGN UP
          </button>
        </form>

        <div className="move-page">
          <span>Have already an account?</span>
          <a href="/login">SIGN IN NOW</a>
        </div>
        {this.state.data.success ? (
          <div className="register__notify--success">
          <div className="notify-overlay"></div>
          <div className="success-checkmark">
            <div className="check-icon mt-1">
              <span className="check-icon--line check-icon--tip"></span>
              <span className="check-icon--line check-icon--long"></span>
              <div className="check-icon--circle"></div>
              <div className="check-icon--fix"></div>
            </div>
            <span className="fz-14 mt-1">
              {this.state.data.message}
            </span>
            <button onClick={this.handleMoveToLoginPage} className="mt-2 mb-2">
              Đăng nhập
            </button>
          </div>
            </div>
           ) : null}
      </div>
    );
  }
}

export default registerScreen;
