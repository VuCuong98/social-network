import React, { Component } from "react";
import avartaImg from "../images/avata.png";
import friendIcon from "../images/friends.png";
import Header from "../components/header.jsx";
import Post from "../components/post.jsx";
import Modal from "../components/modal.jsx";
import FriendRequest from "../components/friendRequest.jsx";
import Friend from "../components/friend.jsx";
import Comment from "../components/comment.jsx";
class homeSreen extends Component {
  state = {
    currentUser: {},
    pageNumber: 1,
    pageSize: 5,
    data: [],
    requestAddFriend: [],
    friends: [],
    commentText: "",
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
          console.log(this.state.currentUser);
        }
      })
      .catch((error) => {
        this.setState({
          errMessage: error.message,
        });
      });
  };

  getPosts = () => {
    fetch(
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
        this.setState({
          data: data.data,
        });
      })
      .catch();
  };
  getRequestAddFriend = () => {
    fetch("http://localhost:3001/api/friends/request-add", {
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
        this.setState({
          requestAddFriend: data.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // get friends
  getFriends = () => {
    fetch("http://localhost:3001/api/friends/friends", {
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
        this.setState({
          friends: data.data.friends,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  componentWillMount() {
    this.checkLogedIn();
    this.getPosts();
    this.getRequestAddFriend();
    this.getFriends();
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
        for (let i = 0; i < this.state.data.length; i++) {
          if (data.data._id === this.state.data[i]._id) {
            var dataState = this.state.data;
            dataState[i].like = data.data.like;
            console.log(this.state.data);
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
  // Đồng ý kết bạn
  handleAcceptFriendRequest = (senderId) => {
    fetch("http://localhost:3001/api/friends/accept-friend", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newFriendId: senderId,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        this.setState({
          requestAddFriend: data.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // Từ chối kết bạn
  handleDelFriendRequest = (senderId) => {
    fetch("http://localhost:3001/api/friends/del-request", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        senderId: senderId,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        this.setState({
          requestAddFriend: data.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Comment
  handleCommentChange = (event) => {
    this.setState({
      commentText: event.target.value,
    });
  };
  handleComment = (postId) => {
      fetch("http://localhost:3001/api/posts/comments", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: postId,
          content: this.state.commentText,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          for (let i = 0; i < this.state.data.length; i++) {
            if (data.data._id === this.state.data[i]._id) {
              var dataState = this.state.data;
              dataState[i].comment = data.data.comment;
              console.log(this.state.data);
              this.setState({
                data: dataState,
              });
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    
  };
  render() {
    // console.log(this.state);
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
              <div className="col col-xl-3 col-lg-0">
                <div className="main__left">
                  <div href="#" className="main__left-item">
                    <a href="#" className="friend__avatar">
                      <img
                        src={
                          this.state.currentUser.avatarUrl
                            ? `http://localhost:3001${this.state.currentUser.avatarUrl}`
                            : avartaImg
                        }
                        alt="avatar"
                      />
                    </a>
                    <span className="text-center">
                      {this.state.currentUser?.fullName}
                    </span>
                  </div>
                  <div className="main__left-item" id="open-friend-list">
                    <a href="#" className="friend__avatar">
                      <img src={friendIcon} alt="" />
                    </a>
                    <span className="text-center">Bạn bè</span>
                  </div>
                </div>
                <div className="friend-req">
                  <div className="friend-req__close">&times;</div>
                  <h2 className="title--h2">Bạn bè</h2>
                  <h3 className="title--h4 mt-2 mb-2">
                    {this.state.requestAddFriend?.length} lời mời kết bạn
                  </h3>
                  {this.state.requestAddFriend
                    ? this.state.requestAddFriend.map((item) => {
                        return (
                          <FriendRequest
                            acceptRequest={(e) => {
                              e.preventDefault();
                              this.handleAcceptFriendRequest(item.sender._id);
                            }}
                            delRequest={(e) => {
                              e.preventDefault();
                              this.handleDelFriendRequest(item.sender._id);
                            }}
                            avatar={
                              item.sender.avatarUrl
                                ? `http://localhost:3001${item.sender.avatarUrl}`
                                : avartaImg
                            }
                            name={item.sender.fullName}
                          />
                        );
                      })
                    : null}
                </div>
              </div>
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
                        submitComment={(e) => {
                          e.preventDefault();
                          this.handleComment(item._id);
                        }}
                        key={item._id}
                        commentText={this.handleCommentChange}
                        comment={item.comment?.map((commentItem) => {
                          return (
                            <Comment
                            time ={commentItem.createdAt}
                              avatar={
                                commentItem.user?.avatarUrl
                                  ? `http://localhost:3001${commentItem.user.avatarUrl}`
                                  : avartaImg
                              }
                              content={commentItem.content}
                              author={commentItem.user?.fullName}
                            />
                          );
                        })}
                        likeIcon={
                          item.like.length ? (
                            <i className="fas fa-thumbs-up mr-1 p-05 border-radius-50 primary-color fz-14"></i>
                          ) : null
                        }
                        moveToProfileScreen={`/profile/${item.author._id}`}
                        createdAt={item.createdAt}
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
                              <a
                                href="#"
                                className="post__like-icon primary-color"
                              >
                                <i class=" fas fa-thumbs-up mr-1"></i>
                                Thích
                              </a>
                            ) : (
                              <a
                                href="#"
                                className="post__like-icon fuzzy-color post__like--inactive"
                              >
                                <i class=" far fa-thumbs-up mr-1"></i>
                                Thích
                              </a>
                            )}
                          </a>
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
              <div className="col col-xl-3 col-lg-3">
                <div className="friends__list">
                  <div className="friends__head d-flex justify-content-between pr-2">
                    <h4 className="title--h4">Người liên hệ</h4>
                    <label
                      htmlFor="friend__search-checkbox"
                      className="friend__search--icon text-color fz-14"
                    >
                      <i class="fas fa-search"></i>
                    </label>
                  </div>
                  <input type="checkbox" id="friend__search-checkbox" hidden />
                  <div className="friend__search">
                    <input
                      type="text"
                      className="mt-1 w-100"
                      placeholder="tìm kiếm"
                    />
                    <a
                      href="#"
                      className="friend__search--action text-color fz-14"
                    >
                      <i class="fas fa-search"></i>
                    </a>
                  </div>
                  {this.state.friends
                    ? this.state.friends.map((item) => {
                        return (
                          <Friend
                            avatar={
                              item.avatarUrl
                                ? `http://localhost:3001${item.avatarUrl}`
                                : avartaImg
                            }
                            name={item.fullName}
                          />
                        );
                      })
                    : null}
                </div>
              </div>
            </div>
          </section>
        </div>
        <Modal avartaImg={avartaImg} />
      </div>
    );
  }
}

export default homeSreen;
