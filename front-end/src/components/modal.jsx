import React, { Component } from "react";

class modal extends Component {
  state = {
    content: "",
    imageFile: undefined,
    base64Image: [],
    loading: false,
    errorMessage: '',
  };
  imageFileList = [];
  base64ImageList = [];
  handleContentChange = (event) => {
    console.log(event.target.value);
    this.setState({
      content: event.target.value,
    });
  };

  handleFileChange = (event) => {
    event.preventDefault();
    // show preview
    const imageFile = event.target.files[0];
    if (imageFile) {
      const reader = new FileReader();
      this.imageFileList.push(imageFile);
      reader.onloadend = () => {
        this.base64ImageList.push(reader.result);
        // save to state
        this.setState({
          imageFile: this.imageFileList,
          base64Image: this.base64ImageList,
        });
      };
      reader.readAsDataURL(imageFile);
    }
  };

  handleRemoveFile = (event) => {
    event.preventDefault();
    this.imageFileList = [];
    this.base64ImageList = [];
    this.setState({
      imageFile: undefined,
      base64Image: [],
    });
  };

  handlePostFormSubmit = (event) => {
    event.preventDefault();
    this.setState({
      loading: true,
    });

    const formData = new FormData();
    for(let i = 0; i< this.state.imageFile.length; i++){
      formData.append('image', this.state.imageFile[i])
    }
    // fetch api upload file
    console.log(formData);
    fetch('http://localhost:3001/api/uploads/img', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })
    .then((res)=>{
      return res.json();
    })
    .then((data) => {
      console.log(data);
      fetch('http://localhost:3001/api/posts',{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        credentials:'include',
        body: JSON.stringify({
          content: this.state.content,
          imageUrl: data.data.imageUrl,
        })
      })
      .then((response) => {
        return response.json();
      })
      .then(responseData => {
        window.location.href = "/"
      })
      .catch((err) => {
        this.setState({
          loading: false,
          errorMessage: err,
        })
      })
    })
    .catch((err) => {
      this.setState({
        errorMessage: err,
        loading: false,
      })
    })

    // fetch api create post

  };
  render() {
    return (
      <div className="modal">
        <div className="modal__overlay"></div>
        <div className="modal__post">
          <div className="modal__head">
            <h3 className="title--h3 text-center">Tạo bài viết</h3>
            <div className="border--line"></div>
            <a href="#" className="modal__close" id="modal-close"></a>
          </div>
          <div className="modal__body">
            <form action="#" className="post__form" onSubmit={this.handlePostFormSubmit}>
              <div className="post__author">
                <a href="#" className="post__avt">
                  <img src={this.props.avartaImg} alt="avatar" />
                </a>
                <a href="#" className="post__author--name text-center">
                  Vũ Cường
                </a>
              </div>
              <div className="post__content-box">
                <textarea
                  value={this.state.content}
                  onChange={this.handleContentChange}
                  className="post__input--text"
                  type="text"
                  placeholder="Vu oi, ban dang nghi gi the?"
                ></textarea>
                {this.state.imageFile ? (
                  <div className="preview">
                    <a
                      href="#"
                      className="preview__close"
                      onClick={this.handleRemoveFile}
                    ></a>
                    <div className="row">
                      {this.state.base64Image.map((item) => {
                        return (
                          <div className="col col-lg-4" key={item}>
                            <div
                              className="preview__item"
                              style={{ backgroundImage: `url(${item})` }}
                            ></div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                <div className="post__option">
                  <h6 className="title--h6">Thêm vào bài viết</h6>
                  <div className="post__item">
                    <a href="#" className="post__video">
                      <i class="fas fa-video"></i>
                    </a>
                    <a href="#" className="post__image">
                      <input
                        onChange={this.handleFileChange}
                        type="file"
                        name=""
                        id=""
                        multiple
                      />
                      <i class="far fa-images"></i>
                    </a>
                    <a href="#" className="post__feeling">
                      <i class="far fa-laugh-squint"></i>
                    </a>
                  </div>
                </div>
              </div>
              {this.state.imageFile ? (
                <button type="submit" className="btn btn--post btn--primary">Đăng</button>
              ) : (
                <button className="btn btn--grey btn--post">Đăng</button>
              )}
            </form>
          </div>
        </div>
        
      </div>
    );
  }
}

export default modal;
