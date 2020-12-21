import React, { Component } from "react";

class verifyScreen extends Component {
  state = {
    data: {},
  };
  componentWillMount = () => {
    const pathname = window.location.pathname;
    const pathnameItem = pathname.split("/");
    const token = pathnameItem[pathnameItem.length - 1];
    console.log(token);
    fetch(`http://localhost:3001/api/auth/confirmToken`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        this.setState({
          data: data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  handleMoveToLoginPage = (e) => {
    e.preventDefault();
    window.location.href = "/login";
  };
  render() {
    return (
      <div className="vertify-container text-center">
        {this.state.data.success ? (
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
        ) : (
          <div className="vertify__unsuccess d-flex flex-column justify-content-around">
              <div className="unsuccess__logo"></div>
            <span className="error-message fz-14 mt-1">{this.state.data.message}</span>
            <a href="/" className="mt-2 btn btn--primary">Đồng ý</a>
          </div>
        )}
      </div>
    );
  }
}

export default verifyScreen;
