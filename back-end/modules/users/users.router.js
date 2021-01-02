const express = require("express");
const session = require("express-session");
const BlockModel = require("../friend/block.model.js");
const UserModel = require("./users.model.js");
const userRouter = express.Router();

// changer avatar

userRouter.get("/get_user/:userId", (req, res) => {
  // console.log(req.params);
  const userId = req.params.userId;
  UserModel.findById(userId, (err, data) => {
    if (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    } else {
      res.status(200).json({
        success: true,
        data: data,
      });
    }
  });
});

userRouter.post("/update-avt", (req, res) => {
  console.log(req.session.currentUser);
  if (req.session.currentUser) {
    UserModel.findByIdAndUpdate(
      req.session.currentUser._id,
      { avatarUrl: req.body.imageUrl },
      (err, data) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "avatar update fail",
          });
        } else {
          res.status(200).json({
            success: true,
            data: data,
          });
        }
      }
    );
  }
});

userRouter.post("/update-bg", (req, res) => {
  console.log(req.session.currentUser);
  if (req.session.currentUser) {
    UserModel.findByIdAndUpdate(
      req.session.currentUser._id,
      { backgroundUrl: req.body.imageUrl },
      (err, data) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "background update fail",
          });
        } else {
          res.status(200).json({
            success: true,
            data: data,
          });
        }
      }
    );
  }
});

// Chặn người dùng

userRouter.post("/set_block", (req, res) => {
  BlockModel.find({ _userId: req.session.currentUser._id }, (err, data) => {
    if (err) {
      res.json({
        success: false,
        message: err.message,
      });
    } else {
      // console.log(data);
      if (data.length < 1) {
        BlockModel.create({
          _userId: req.session.currentUser._id,
          block: [req.body.userId],
        });
      } else {
        BlockModel.findOneAndUpdate(
          { _userId: req.session.currentUser._id },
          { $push: { block: req.body.userId } },
          { new: true },
          (error, newData) => {
            if(err){
              res.json({
                success: false,
                message: err.message
              })
            } else {
              res.json({
                success: true,
                data: newData
              })
            }
          }
        );
      }
    }
  });
});

// Get danh sách chặn

userRouter.get("/get_block", (req, res) => {
  BlockModel.findOne({_userId: req.session.currentUser._id}, (err, data) => {
    if(err){
      res.json({
        success: false,
        message: err.message,
      })
    } else {
      res.json({
        success: true,
        data: data
      })
    }
  })
})

module.exports = userRouter;
