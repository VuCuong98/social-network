import React, { Component } from "react";
import avartaImg from "../images/avata.png";

class friendRequest extends Component {
  render() {
    return (
      <div className="friend-req__item">
        <a href="#" className="friend-req__avt">
          <img src={this.props.avatar} alt="" />
        </a>
        <div className="d-flex flex-column flex-1">
          <span className="">{this.props.name}</span>
          <div className="d-flex justify-content-between mt-1 w-100">
            <button className="btn btn--primary btn--accept" onClick = {this.props.acceptRequest}>Xác nhận</button>
            <button className="btn btn--del" onClick={this.props.delRequest}>Xóa</button>
          </div>
        </div>
      </div>
    );
  }
}

export default friendRequest;
