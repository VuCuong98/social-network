const express = require("express");
const joi = require("@hapi/joi");
const PostModel = require("./posts.model");

const postRouter = express.Router();

postRouter.get("/:id", async (req, res) => {
  if (!req.params.id) {
    res.status(401).json({
      success: false,
      message: "Bad request",
    });
  } else {
    const post = await PostModel.find({ author: `${req.params.id}` })
      .populate("author")
      .lean();

    console.log(post);
    res.status(200).json({
      success: true,
      data: post,
    });
  }
});

// POST

postRouter.post("/", async (req, res) => {
  // authenticate
  if (!req.session.currentUser) {
    res.status(401).json({
      success: false,
      message: "Hãy đăng nhập để đăng bài!",
    });
  } else {
    // validate
    // save to data
    const newPostInfo = {
      content: req.body.content,
      imageUrl: req.body.imageUrl,
      author: req.session.currentUser._id,
    };
    const newPost = await PostModel.create(newPostInfo);
    res.status(200).json({
      success: true,
      data: newPost,
    });
  }
});

// Lấy thông tin bài viết
postRouter.get("/", async (req, res) => {
  try {
    const pageNumber = Number(req.query.pageNumber);
    const pageSize = Number(req.query.pageSize);
    const data = await PostModel.find()
      .populate("author")
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//  Like post
postRouter.post("/like", async (req, res) => {
  const postId = req.body.postId;
  console.log(postId);

    PostModel.findById(postId, (err, data) => {
      if (err) {
        res.status(400).json({
          success: false,
        });
      } else {
        if (data.like.includes(`${req.body.userId}`, 0) == false) {
          PostModel.findByIdAndUpdate(
            postId,
            { $push: { like: req.body.userId } }, {new: true},
            (error, updateData) => {
              if (error) {
                res.status(400).json({
                  success: false,
                  message: "Bad request",
                });
              } else {
                res.status(200).json({
                  success: true,
                  data: updateData,
                });
              }
            }
          );
        } else {
          // delete like post
          PostModel.findByIdAndUpdate(
            postId,
            { $pull: { like: req.body.userId } }, {new : true},
            (error, updateData) => {
              if (error) {
                res.status(400).json({
                  success: false,
                  message: "Bad request",
                });
              } else {
                res.status(200).json({
                  success: true,
                  data: updateData,
                });
              }
            }
          );
        }
      }
    });
  // await PostModel.findByIdAndUpdate(postId, {"$push": {"like" : req.session.currentUser._id}}, (err, data)=>{
  //     if(err){
  //         res.status(400).json({
  //             success: false,
  //             message: "Bad request"
  //         })
  //     } else {
  //         res.status(200).json({
  //             success: true,
  //             data: data,
  //         })
  //     }
  // })
});

module.exports = postRouter;
