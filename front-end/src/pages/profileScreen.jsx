import React, { Component } from "react";
import Header from "../components/header.jsx";
import Post from "../components/post.jsx";
import avatarImg from "../images/avata.png";
import Comment from "../components/comment.jsx";
class profileScreen extends Component {
  state = {
    commentText: "",
    userInfo: {},
    postData: [],
    avatarFile: "",
    backgroundFile: "",
    base64Background: undefined,
    base64Avatar: undefined,
  };
  componentWillMount() {
    // GET CURRENT USER
    const pathname = window.location.pathname;
    var userId = pathname.split("/");
    userId = userId[userId.length - 1];
    fetch(`http://localhost:3001/api/users/get_user/${userId}`, {
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
          userInfo: data.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });

    // GET post with userId
    fetch(`http://localhost:3001/api/posts/${userId}`, {
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
          postData: data.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  fetchApiUpdate = (api, file) => {
    const formData = new FormData();
    formData.append("image", file);
    fetch("http://localhost:3001/api/uploads/avt-bg", {
      method: "POST",
      credentials: "include",
      body: formData,
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        fetch(`http://localhost:3001/api/users/${api}`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageUrl: data.data.imageUrl,
          }),
        })
          .then((res) => {
            return res.json();
          })
          .then((responseData) => {
            console.log(responseData);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleAvtFileChange = (event) => {
    console.log(event.target.files);
    const imageFile = event.target.files[0];
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // save to state
        this.setState({
          avatarFile: imageFile,
          base64Avatar: reader.result,
        });
        console.log(this.state);
      };
      reader.readAsDataURL(imageFile);
    }
  };

  handleBackgroundChange = (event) => {
    console.log(event.target.files);
    const imageFile = event.target.files[0];
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // save to state
        this.setState({
          backgroundFile: imageFile,
          base64Background: reader.result,
        });
        console.log(this.state);
      };
      reader.readAsDataURL(imageFile);
    }
  };

  handleAvtSave = async (event) => {
    await this.fetchApiUpdate("update-avt", this.state.avatarFile);
    window.location.reload();
  };

  handleBgSave = async (event) => {
    await this.fetchApiUpdate("update-bg", this.state.backgroundFile);
    window.location.reload();
  };

  handleAddFriend = (e) => {
    e.preventDefault();
    fetch("http://localhost:3001/api/friends/add-friend", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        receiver: this.state.userInfo._id,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
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
        userId: window.localStorage.getItem("id"),
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        for (let i = 0; i < this.state.postData.length; i++) {
          if (data.data._id === this.state.postData[i]._id) {
            var dataState = this.state.postData;
            dataState[i].like = data.data.like;
            console.log(this.state.data);
            this.setState({
              postData: dataState,
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
        for (let i = 0; i < this.state.postData.length; i++) {
          if (data.data._id === this.state.postData[i]._id) {
            var dataState = this.state.postData;
            dataState[i].comment = data.data.comment;
            console.log(this.state.data);
            this.setState({
              postData: dataState,
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
    if (this.state.base64Background) {
      document.querySelector(
        ".profile__background"
      ).style.backgroundImage = `url(${this.state.base64Background})`;
    }

    const totalLike = (total) => {
      var liked = "";
      if (total.includes(`${this.state.userInfo._id}`) && total.length > 1) {
        liked = `Bạn và ${total.length - 1} người khác`;
      } else if (
        total.includes(`${this.state.userInfo._id}`) &&
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
      <div>
        <Header />
        <div className="profile-container">
          <div className="grid">
            <div className="row">
              <div className="profile__header">
                <div className="col col-lg-8 col-lg-o-2">
                  <div
                    className="profile__background"
                    style={
                      this.state.userInfo.backgroundUrl
                        ? {
                            backgroundImage: `url(http://localhost:3001${this.state.userInfo.backgroundUrl})`,
                          }
                        : null
                    }
                  >
                    {this.state.base64Background ? (
                      <div className="save-background">
                        <a href="#" className="btn btn--grey mr-1 p-1">
                          Hủy
                        </a>
                        <a
                          href="#"
                          className="btn btn--primary mr-1 p-1"
                          onClick={this.handleBgSave}
                        >
                          Lưu
                        </a>
                      </div>
                    ) : (
                      <a href="#" className="btn add-background">
                        <input
                          type="file"
                          onChange={this.handleBackgroundChange}
                        />
                        <i class="fas fa-camera"></i>
                        Thêm ảnh bìa
                      </a>
                    )}
                  </div>
                  <div className="profile__avatar">
                    <img
                      src={
                        this.state.userInfo.avatarUrl
                          ? `http://localhost:3001${this.state.userInfo.avatarUrl}`
                          : avatarImg
                      }
                      alt=""
                    />
                    <a href="#" className="add-avatar">
                      <input type="file" onChange={this.handleAvtFileChange} />
                      <i class="fas fa-camera"></i>
                    </a>
                  </div>
                  <div className="profile__name">
                    {this.state.userInfo.fullName}
                  </div>
                  {this.state.base64Avatar ? (
                    <div className="image-preview">
                      <div
                        className="img"
                        style={{
                          backgroundImage: `url(${this.state.base64Avatar})`,
                        }}
                      ></div>
                      <div className="image-preview__submit">
                        <button
                          className="btn btn--primary"
                          onClick={this.handleAvtSave}
                        >
                          Lưu
                        </button>
                      </div>
                    </div>
                  ) : null}
                  {/*  */}
                  <div className="profile__nav">
                    <div className="profile__nav--left"></div>
                    <div className="profile__nav--right">
                      {this.state.userInfo._id ==
                      window.localStorage.getItem('id') ? null : (
                        <a
                          href="#"
                          className="profile__add-friend text-center"
                          onClick={this.handleAddFriend}
                        >
                          <i class="fas fa-user-plus mr-1"></i>
                          Thêm bạn bè
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="profile__body pt-2">
                <div className="col col-lg-8 col-lg-o-2">
                {this.state.postData.map((item) => {
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
                                  : avatarImg
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
                            : avatarImg
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
                              `${this.state.userInfo._id}`,
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
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default profileScreen;
