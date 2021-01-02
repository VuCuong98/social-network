import React, { Component } from "react";
import Header from "../components/header.jsx";
import Message from "../components/message.jsx";
import logo from "../images/imageMess/logo.svg";
import avatarImg from "../images/avata.png";
class messageScreen extends Component {
  state = {
    conversation: undefined,
    data: [],
  };
  // get messages
  getMessage = async () => {
    await fetch("http://localhost:3001/api/messages/get-message", {
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
          data: data.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // get conversation
  getConversation = async () => {
    const href = window.location.href;
    var conversationId = href.split("/")[href.split("/").length - 1];
    this.state.data.map((item) => {
      if (item._id === conversationId) {
        this.setState({
          conversation: item,
        });
      }
    });
  };

  async componentWillMount() {
    await this.getMessage();
    this.getConversation();
  }

  handleOpenConversation = (conversationId) => {
    window.location.href = `/message/${conversationId}`;
  };

  handleInputMessageChange = (event) => {
      this.setState({
          message: event.target.value,
      })
  }

  handleSendMessage = () => {
      var memberId;
      this.state.conversation.members.map(item => {
          if(item._id !== window.localStorage.getItem("id")){
              memberId = item._id;
          }
      })
      console.log(memberId);
      fetch('http://localhost:3001/api/messages/send-message', {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
              memberId: memberId,
              message: this.state.message,
          })
      })
      .then(res => {
          return res.json();
      })
      .then(data => {
          this.state.data.map(item => {
              if(item._id == data.data._id){
                  item = data.data
                  document.getElementById('text-message').value = "";
                  this.setState({
                    conversation: data.data,
                    data: this.state.data,
                })
              }
          })
       
      })
      .catch(err => {
          console.log(err);
      })
  }
  render() {
      console.log(this.state);
    if (this.state.conversation) {
      const conversation = this.state.conversation;
    }
    return (
      <div className="messenger-container">
        <div className="grid">
          <Header />
          <main className="main bg-primary mess__main">
            <div className="row h-100">
              <div class="mess__left col col-2 col-lg-3">
                <div class="col-content">
                  {this.state.data.map((item) => {
                    var friend;
                    for (let i = 0; i < item.members.length; i++) {
                      if (
                        !(item.members[i]._id == window.localStorage.getItem("id"))
                      ) {
                        friend = item.members[i];
                      }
                    }
                    const conversation = item.conversation;
                    return (
                      <Message
                        openConversation={(e) => {
                          e.preventDefault();
                          this.handleOpenConversation(item._id);
                        }}
                        avatar={`http://localhost:3001${friend.avatarUrl}`}
                        author={friend.fullName}
                        lastMessage={
                          conversation[conversation.length - 1].message
                        }
                      />
                    );
                  })}
                </div>
              </div>
              <div className="col col-lg-6">
                <div className="conversation">
                  <div className="conversation__body">
                    {this.state.conversation
                      ? this.state.conversation.conversation.map((item) => {
                          if (
                            window.localStorage.getItem("id") !== item.user._id
                          ) {
                            return (
                              <div className="conversation__sender conversation__item">
                                <a className="friend__avatar friend__avatar--small">
                                  <img src={`http://localhost:3001${item.user.avatarUrl}`} />
                                </a>
                                <div className="text-color fz-14 conversation__text">
                                  {item.message}
                                </div>
                              </div>
                            );
                          } else {
                            return (
                              <div className="conversation__receiver conversation__item">
                                <div className="text-color fz-14 conversation__text">
                                  {item.message}
                                </div>
                              </div>
                            );
                          }
                        })
                      : null}
                  </div>
                  <div className="conversation__input">
                    <input type="text" placeholder="Aa" onChange={this.handleInputMessageChange} id="text-message"/>
                    <a className="text-center" onClick={this.handleSendMessage}>
                      <i class="fas fa-paper-plane"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div className="col col-lg-3">
                <div className="mess__right"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default messageScreen;
