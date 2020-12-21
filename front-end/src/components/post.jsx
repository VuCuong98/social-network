import React, { Component } from "react";

class post extends Component {
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
            <span className="post__time">{this.props.createdAt}</span>
          </div>
        </div>
        <div className="post__content">
          <p className="post__caption">{this.props.postContent}</p>
          <div className="post__img">{this.props.postImg}</div>
        </div>
        <div className="d-flex flex-column mt-1 pl-1 pr-1">
          <div className="d-flex justify-content-between">
            <span className="total-like text-color fz-14">
              <i className="fas fa-thumbs-up mr-1 p-05 border-radius-50 bg-primary fz-1"></i>
              <span>{this.props.totalLike}</span>
            </span>
            <span className="total-comment text-color fz-14">3 bình luận</span>
          </div>
          <div className="d-flex mt-2 justify-content-between post__action-list">
            {this.props.postLike}

            <a href="#" className="fuzzy-color fz-14 text-center post__action-item">
              <i class="far fa-comment-alt mr-1"></i>Bình luận
            </a>
            <a href="#" className="fuzzy-color fz-14 text-center post__action-item">
              <i class="far fa-share-square mr-1"></i>Chia sẻ
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default post;
