import React, { Component } from "react";
import avatarImg from "../images/avata.png";
class message extends Component {
  render() {
    return (
      <div className="message mt-1" onClick={this.props.openConversation}>
        <a className="friend__avatar friend__avatar--medium">
          <img src={this.props.avatar} />
        </a>
        <div className="message__box">
            <span className="text-color fw-600">{this.props.author}</span>
            <span className="fuzzy-color mt-1">{this.props.lastMessage}</span>
        </div>
      </div>
    );
  }
}

export default message;
