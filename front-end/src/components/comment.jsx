import React, { Component } from "react";
class comment extends Component {
  // converst timestamp/isoDate
  convertTimestamp = (createdAt) => {
    var currentDate = new Date();
    currentDate = currentDate.getTime();
    createdAt = new Date(createdAt);
    createdAt = createdAt.getTime();
    const differentDay = currentDate - createdAt;
    const days = differentDay / (24 * 60 * 60 * 1000);
    if (days < 1) {
      const hour = differentDay / (1000 * 60 * 60);
      if (hour < 1) {
        const minutes = differentDay / (1000 * 60);
        if (minutes < 1) {
          createdAt = "Vừa xong";
        } else {
          createdAt = `${Math.floor(minutes)} phút`;
        }
      } else {
        createdAt = `${Math.floor(hour)} giờ`;
      }
    } else {
      createdAt = `${Math.floor(days)} ngày`;
    }
    return createdAt;
  };
  render() {
    return (
      <div className="comment__item mt-2">
        <a href="#" className="commentator__avatar">
          <img src={this.props.avatar} alt="avatar" />
        </a>
        <div className="comment__box">
          <a href="#" className="comment__author text-color fw-600">
            {this.props.author}
          </a>
          <span className="comment__text text-color">{this.props.content}</span>
        </div>
        <span className="comment__time">
          {this.convertTimestamp(this.props.time)}
        </span>
      </div>
    );
  }
}

export default comment;
