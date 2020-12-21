const express = require("express");
const UserModel = require("./users.model.js");
const userRouter = express.Router();

// changer avatar

userRouter.get("/:userId", (req, res) => {
  console.log(req.params);
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

module.exports = userRouter;
