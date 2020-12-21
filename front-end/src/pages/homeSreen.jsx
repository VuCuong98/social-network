import React, { Component } from "react";
import avartaImg from "../images/avata.png";

import Header from "../components/header.jsx";
import Post from "../components/post.jsx";
import Modal from "../components/modal.jsx";
class homeSreen extends Component {
  state = {
    currentUser: {},
    pageNumber: 1,
    pageSize: 5,
    data: [],
  };
  // Kiểm tra tài khoản  đã đăng nhập hay chưa
  checkLogedIn = () => {
    fetch("http://localhost:3001/api/auth/get-current-user", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("user logged in");
        if (data.success == false) {
          window.location.href = "/login";
        } else {
          this.setState({
            currentUser: data.data,
          });
        }
      })
      .catch((error) => {
        this.setState({
          errMessage: error.message,
        });
      });
  };

  // converst timestamp/isoDate
  convertTimestamp = () => {
    var currentDate = new Date();
    currentDate = currentDate.getTime();
    if (this.state.data) {
      var data = this.state.data;
      for (let i = 0; i < this.state.data.length; i++) {
        let timestamp = data[i].createdAt;
        timestamp = new Date(timestamp);
        timestamp = timestamp.getTime();
        const differentDay = currentDate - timestamp;
        const days = differentDay / (24 * 60 * 60 * 1000);
        if (days < 1) {
          const hour = differentDay / (1000 * 60 * 60);
          if (hour < 1) {
            const minutes = differentDay / (1000 * 60);
            if (minutes < 1) {
              data[i].created = "Vừa xong";
            } else {
              data[i].created = `${Math.floor(minutes)} phút`;
            }
          } else {
            data[i].created = `${Math.floor(hour)} giờ`;
          }
        } else {
          data[i].created = `${Math.floor(days)} ngày`;
        }
      }
      this.setState({
        data: data,
      });
    }
  };

  async componentWillMount() {
    this.checkLogedIn();
    await fetch(
      `http://localhost:3001/api/posts?pageNumber=${this.state.pageNumber}&pageSize=${this.state.pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        this.setState({
          data: data.data,
        });
      })
      .catch();
    this.convertTimestamp();
  }
  handleMoveToProfileScreen = (event) => {
    if (event) {
      window.location.href = `/profile/${event}`;
    }
  };

  handleLike = (postId) => {
    fetch(`http://localhost:3001/api/posts/like`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: postId,
        userId: this.state.currentUser._id,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        console.log(this.state);
        for (let i = 0; i < this.state.data.length; i++) {
          if (data.data._id === this.state.data[i]._id) {
            var dataState = this.state.data;
            dataState[i].like = data.data.like;
            this.setState({
              data: dataState,
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  render() {
    const totalLike = (total) => {
      var liked = "";
      if (total.includes(`${this.state.currentUser._id}`) && total.length > 1) {
        liked = `Bạn và ${total.length - 1} người khác`;
      } else if (
        total.includes(`${this.state.currentUser._id}`) &&
        total.length == 1
      ) {
        liked = `Bạn`;
      } else if (total.length == 0) {
        liked = "";
      } else {
        liked = total.length;
      }
      return liked;
    };
    return (
      <div className="container">
        <div className="grid">
          <Header />
          <section className="main">
            <div className="row">
              <div className="col col-xl-3 col-lg-0"></div>
              <div className="col col-xl-6 col-lg-9">
                <div className="main__body">
                  <div className="main__post">
                    <div className="post__author">
                      <a href="#" className="post__avt">
                        <img
                          src={
                            this.state.currentUser.avatarUrl
                              ? `http://localhost:3001${this.state.currentUser.avatarUrl}`
                              : avartaImg
                          }
                          alt="avatar"
                        />
                      </a>
                      <a href="#" className="post__field" id="open-modalPost">
                        <span>Vũ Cường ơi, bạn đang nghĩ gì thế?</span>
                      </a>
                    </div>
                    <div className="post__item">
                      <a href="#" className="post__video">
                        <i class="fas fa-video"></i>
                        <span>Video trực tiếp</span>
                      </a>
                      <a href="#" className="post__image">
                        <i class="far fa-images"></i>
                        <span>Ảnh/Video</span>
                      </a>
                      <a href="#" className="post__feeling">
                        <i class="far fa-laugh-squint"></i>
                        <span>Cảm xúc/Hoạt động</span>
                      </a>
                    </div>
                  </div>
                  {this.state.data.map((item) => {

                    return (
                      <Post
                        key={item._id}
                        moveToProfileScreen={`/profile/${item.author._id}`}
                        createdAt={item.created}
                        author={item.author.fullName}
                        totalLike={totalLike(item.like)}
                        postAvt={
                          item.author.avatarUrl
                            ? `http://localhost:3001${item.author.avatarUrl}`
                            : avartaImg
                        }
                        postContent={item.content}
                        postLike={
                          <a
                            href="#"
                            className="fz-14 text-center post__action-item post__like"
                            onClick={(e) => {
                              e.preventDefault();
                              this.handleLike(item._id);
                            }}
                          >
                            {item.like.includes(
                              `${this.state.currentUser._id}`,
                              0
                            ) ? (
                              <a href="#" className="post__like-icon primary-color">
                                <i class=" fas fa-thumbs-up mr-1"></i>
                                Thích
                              </a>
                            ) : (
                              <a href="#" className="post__like-icon fuzzy-color post__like--inactive">
                                <i class=" far fa-thumbs-up mr-1"></i>
                                Thích
                              </a>
                            )}
                          </a>

                          // item.like.includes(
                          //   `${this.state.currentUser._id}`,
                          //   0
                          // ) ? (
                          //   <a
                          //     href="#"
                          //     className="primary-color fz-14 text-center post__action-item post__like post__like--active "
                          //     onClick = {(e) => {e.preventDefault();this.handleLike(item._id)}}
                          //   >
                          //     <i class="fas fa-thumbs-up mr-1"></i>Thích
                          //   </a>
                          // ) : (
                          //   <a
                          //     href="#"
                          //     className="fuzzy-color fz-14 text-center post__action-item post__like"
                          //     onClick = {(e) => {e.preventDefault();this.handleLike(item._id)}}
                          //   >
                          //     <i class="far fa-thumbs-up mr-1"></i>Thích
                          //   </a>
                          // )
                        }
                        postImg={item.imageUrl.map((i) => {
                          return (
                            <div className="post__img-item" key={i}>
                              <img
                                className=""
                                src={`http://localhost:3001${i}`}
                                alt=""
                              />
                            </div>
                          );
                        })}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="col col-xl-3 col-lg-3"></div>
            </div>
          </section>
        </div>
        <Modal avartaImg={avartaImg} />
      </div>
    );
  }
}

export default homeSreen;
