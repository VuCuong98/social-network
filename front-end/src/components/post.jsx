import React, { Component } from "react";
import avatarImg from "../images/avata.png";

class post extends Component {
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
      <div className="post">
        <div className="post__head d-flex">
          <a href={this.props.moveToProfileScreen} className="post__avt">
            <img src={this.props.postAvt} alt="" />
          </a>
          <div className="d-flex flex-column">
            <a href="#" className="post__author--name">
              {this.props.author}
            </a>
            <span className="post__time">
              {this.convertTimestamp(this.props.createdAt)}
            </span>
          </div>
        </div>
        <div className="post__content">
          <p className="post__caption">{this.props.postContent}</p>
          <div className="post__img">{this.props.postImg}</div>
        </div>
        <div className="d-flex flex-column mt-1 pl-1 pr-1">
          <div className="d-flex justify-content-between">
            <span className="total-like text-color fz-14">
              {this.props.likeIcon}
              <span>{this.props.totalLike}</span>
            </span>
            <span className="total-comment text-color fz-14">3 bình luận</span>
          </div>
          <div className="d-flex mt-2 justify-content-between post__action-list">
            {this.props.postLike}

            <a
              href="#"
              className="fuzzy-color fz-14 text-center post__action-item"
            >
              <i class="far fa-comment-alt mr-1"></i>Bình luận
            </a>
            <a
              href="#"
              className="fuzzy-color fz-14 text-center post__action-item"
            >
              <i class="far fa-share-square mr-1"></i>Chia sẻ
            </a>
          </div>
          <div className="comments">
            {this.props.comment}
            {/* <div className="comment__input"> */}
            <form
              action="#"
              className="comment__input"
              onSubmit={this.props.submitComment}
            >
              <a href="#" className="commentator__avatar">
                <img src={this.props.postAvt} alt="avatar" />
              </a>
              <input
                type="text"
                placeholder="Viết bình luận"
                onChange={this.props.commentText}
              />
              <button type="submit" hidden></button>
            </form>
            {/* </div> */}
          </div>
        </div>
      </div>
    );
  }
}

export default post;
