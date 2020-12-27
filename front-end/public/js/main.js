window.onload = () => {
  if (document.querySelector(".modal")) {
    document.getElementById("modal-close").addEventListener("click", () => {
      document.querySelector(".modal").style.display = "none";
    });
    document.getElementById("open-modalPost").addEventListener("click", () => {
      document.querySelector(".modal").style.display = "block";
      document.querySelector(".modal__post").style.display = "block";
    });
    document.querySelector(".post__image").addEventListener("click", () => {
      document.querySelector(".modal").style.display = "block";
      document.querySelector(".modal__post").style.display = "block";
    })
  }

  // gallery image
  // const maxHeight = 591;
  const imageSizeChange = (imageArray) => {
    const imageFirst = imageArray.children[0];
    const imageSecond = document.createElement('div');
    imageSecond.classList.add('post__img--second');
    const width = imageFirst.offsetWidth;
    const height = imageFirst.offsetHeight;
    for(let j = 1; j < imageArray.children.length; j++){
       let a = imageArray.children[j];
        imageSecond.append(a)
        a.classList.add('post__img--small')
        j -= 1
    }
    // console.log(imageArray);
     imageArray.appendChild(imageSecond)
     if(imageArray.children.length == 1){}
    if (height >= width) {
      imageFirst.style.width = `66.666%`;
      imageFirst.style.height = `100%` //`${maxHeight}px`;
      imageFirst.style.marginRight = '2px'
      imageSecond.style.flexDirection = 'column'
      imageSecond.style.width= `33.333%`;
      imageSecond.style.height = '100%' //`${maxHeight}px`;
    }
  };

  const imageGrid = document.getElementsByClassName("post__img");

  for (let i = 0; i < imageGrid.length; i++) {
    // imageSizeChange(imageGrid[i]);
    const imageArray = imageGrid[i];
    // console.log(imageArray);
    if (imageArray.children.length == 1) {
      imageArray.children[0].style.width = `100%`;
    }
    if (imageArray.children.length == 2) {
      imageArray.children[0].style.width = `50%`;
      imageArray.children[0].style.height = `auto`;
      imageArray.children[0].style.marginRight = `5px`;


      imageArray.children[1].style.width = `50%`;
      imageArray.children[1].style.height = `auto`;
    }
    if (imageArray.children.length >= 3) {
      imageSizeChange(imageArray)
    }
  }


  // Mobile

  // document.querySelector(".m-search").addEventListener('click', () => {
  //     document.querySelector(".m-search__field").style.visibility = "visible";
  //     document.querySelector(".m-search__field").style.top = "var(--header-height)"
  // });

  // const postLikeInactive = document.getElementsByClassName('post__like--inactive');
  // console.log(postLikeInactive);
  

  // Open friend list
  const openFriendList = document.getElementById("open-friend-list");
  openFriendList.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.friend-req').style.display = "block";
    document.querySelector('.main__left').style.display = "none";
  });

  const closeFriendList = document.querySelector('.friend-req__close');
  closeFriendList.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.friend-req').style.display = "none";
    document.querySelector('.main__left').style.display = "block";
  })


  // Open friend search
};
