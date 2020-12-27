import React, { Component } from "react";

class friend extends Component {
  render() {
    return (
      <div className="friend mt-1 d-flex p-1">
        <a href="#" className="friend__avatar">
          <img src={this.props.avatar} alt="avatar" />
        </a>
        <a className="friend__name text-center text-color fz-14">
          {this.props.name}
        </a>
      </div>
    );
  }
}

export default friend;
