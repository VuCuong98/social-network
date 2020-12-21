import React, { Component } from "react";
import avtImg from "../images/avata.png";

class header extends Component {
  state = {
    currentUser: {},
  };

  componentWillMount() {
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
        this.setState({
          currentUser: data.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleLogout(event) {
    event.preventDefault();
    fetch("http://localhost:3001/api/auth/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          window.localStorage.clear();
          window.location.href = "/login";
        }
      });
  }

  moveToHome = () => {
    window.location.href = "/";
  };

  render() {
    const fullName = this.state.currentUser.fullName;
    if (fullName) {
      var name = fullName.split(" ");
      name = name[name.length - 1];
    }

    return (
      <header className="header">
        <div className="row">
          <div className="col col-3 col-lg-3 col-xl-3 col-md-1 col-sm-2 header__left-bar">
            <a href="/" className="logo" onClick={this.moveToHome}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
                alt="logo"
              />
            </a>
            <div className="search-box">
              <input type="text" placeholder="Tìm kiếm" />
              <a href="#" className="">
                <i class="fas fa-search"></i>
              </a>
            </div>
            {/* -- mobile search -- */}
            <div className="m-search">
              <a href="#">
                <label htmlFor="m-search-checkbox">
                  <i class="fas fa-search"></i>
                </label>
              </a>
              <input type="checkbox" id="m-search-checkbox" hidden />
              <div className="m-search__field">
                <input type="text" placeholder="Tìm kiếm" />
              </div>
            </div>
          </div>
          <div className="col col-7 col-lg-6 col-xl-6 col-md-8 col-sm-7 header__main col-md-7">
            <ul className="main-menu">
              <li className="main-menu__item">
                <a href="#" className="main-menu__link active">
                  <i class="fas fa-home"></i>
                </a>
              </li>
              <li className="main-menu__item">
                <a href="#" className="main-menu__link">
                  <i class="fas fa-user-friends"></i>
                </a>
              </li>
              <li className="main-menu__item">
                <a href="#" className="main-menu__link">
                  <i class="fas fa-users"></i>
                </a>
              </li>
            </ul>
            {/* --main menu mobile */}
            <ul className="m-mainmenu">
              <li className="m-mainmenu__item">
                <a href="#" className="m-mainmenu__link active">
                  <i class="fas fa-home"></i>
                </a>
              </li>
              <li className="m-mainmenu__item">
                <a href="#" className="m-mainmenu__link">
                  <i class="fas fa-user-friends"></i>
                </a>
              </li>
              <li className="m-mainmenu__item">
                <a href="#" className="m-mainmenu__link">
                  <i class="fab fa-facebook-messenger"></i>
                </a>
              </li>
              <li className="m-mainmenu__item">
                <a href="#" className="m-mainmenu__link">
                  <i class="fas fa-bell"></i>
                </a>
              </li>
            </ul>
          </div>
          <div className="col col-2 col-lg-3 col-xl-3 col-md-3 col-sm-3 header__right-bar">
            <ul className="right-bar">
              <li className="right-bar__item header__avatar">
                <a
                  href={`/profile/${this.state.currentUser._id}`}
                  className="right-bar__link"
                >
                  <img
                    src={
                      this.state.currentUser.avatarUrl
                        ? `http://localhost:3001${this.state.currentUser.avatarUrl}`
                        : avtImg
                    }
                    alt="avatar"
                  />
                  <span>{name}</span>
                </a>
              </li>
              <li className="right-bar__item right-bar__mess">
                <a href="#" className="right-bar__link">
                  <i class="fab fa-facebook-messenger"></i>
                </a>
              </li>
              <li className="right-bar__item right-bar__bell">
                <a href="#" className="right-bar__link">
                  <i class="fas fa-bell"></i>
                </a>
              </li>
              <li className="right-bar__item right-bar__down">
                <a href="#" className="right-bar__link">
                  <input type="checkbox" id="option-checkbox" hidden />
                  <label htmlFor="option-checkbox" className="text-center">
                    <i class="fas fa-sort-down"></i>
                  </label>
                  <div className="header__dropdown">
                    <a href="#">Thông tin</a>
                    <a href="#" onClick={this.handleLogout}>
                      <i class="fas fa-sign-out-alt"></i>
                      Đăng xuất
                    </a>
                  </div>
                </a>
              </li>
            </ul>
            {/* -- mobile nav -- */}
            <div className="m-nav text-center">
              <input type="checkbox" id="m-nav__checkbox" hidden />
              <a href="#" className="m-nav__link">
                <label htmlFor="m-nav__checkbox">
                  <i class="fas fa-bars"></i>
                </label>
              </a>
              <ul className="m-nav__list">
                <li className="m-nav__item m-nav__avt text-center">
                  <a href="#">
                    <img
                      src={
                        this.state.currentUser.avatarUrl
                          ? `http://localhost:3001${this.state.currentUser.avatarUrl}`
                          : avtImg
                      }
                      alt="avatar"
                    />
                    <span className="ml-2">{fullName}</span>
                  </a>
                </li>
                <li className="m-nav__item">
                  <a href="#">
                    <i class="fas fa-user-friends mr-1"></i>
                    Bạn bè
                  </a>
                </li>
                <li className="m-nav__item text-center">
                  <a href="#" onClick={this.handleLogout}>
                    <i class="fas fa-sign-out-alt mr-1"></i>
                    Đăng xuất
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default header;
