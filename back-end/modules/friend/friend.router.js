const express = require("express");
const NotifyModel = require("../notify/notify.model");
const UsersModel = require("../users/users.model");
const FriendModel = require("./friend.model");
const RequestModel = require("./request.model");

const friendRouter = express.Router();

//  gửi yêu cầu
friendRouter.post("/add-friend", async (req, res) => {
  if (req.session.currentUser) {
    const newRequest = {
      sender: req.session.currentUser._id,
      receiver: req.body.receiver,
    };
    await RequestModel.create(newRequest, async (err, data) => {
      if (err) {
        res.status(500).json({
          success: false,
          message: err.message,
        });
      } else {
        const sender = await UsersModel.findById(req.session.currentUser._id)

        await NotifyModel.create({
          _userId: req.body.receiver,
          notify: `${sender.fullName} đã gửi một yêu cầu kết bạn`
        })
        res.status(200).json({
          success: true,
          data: data,
        });
      }
    });
  }
});

//  Chấp nhận yêu cầu kết bạn
friendRouter.post("/accept-friend", async (req, res) => {
  FriendModel.findOneAndUpdate(
    { _userId: req.session.currentUser._id },
    {
      $push: { friends: req.body.newFriendId },
    },
    { new: true },
    (error, receiver) => {
      if (error) {
        res.status(400).json({
          success: false,
          message: "Bad request",
        });
      } else {
        FriendModel.findOneAndUpdate(
          { _userId: req.body.newFriendId },
          {
            $push: { friends: req.session.currentUser._id },
          },
          { new: true },
          async (error, sender) => {
            if (error) {
              res.status(400).json({
                success: false,
                message: "Bad request",
              });
            } else {
              // Xóa yêu cầu kết bạn
              await RequestModel.deleteOne({ sender: req.body.newFriendId });
              const data = await RequestModel.find({
                receiver: req.session.currentUser._id,
              }).populate("sender", "_id fullName avatarUrl");
              res.status(200).json({
                success: true,
                data: data,
              });
            }
          }
        );
      }
    }
  );
});

// Xóa yêu cầu kết bạn
friendRouter.post("/del-request", async (req, res) => {
  await RequestModel.deleteOne(
    { receiver: req.session.currentUser._id, sender: req.body.senderId },
    async (error) => {
      if (error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      } else {
        const data = await RequestModel.findOne({
          receiver: req.session.currentUser._id,
        }).populate("sender", "_id fullName avatarUrl");
        res.status(200).json({
          success: true,
          data: data,
        });
      }
    }
  );
});

//  get danh sách bạn bè

friendRouter.get("/friends", async (req, res) => {
  if (req.session.currentUser) {
    try {
      const data = await FriendModel.findOne({
        _userId: req.session.currentUser._id,
      }).populate("friends", "fullName _id avatarUrl");
      console.log(data);
      res.status(200).json({
        success: true,
        data: data,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
});

// get danh sách yêu cầu

friendRouter.get("/request-add", async (req, res) => {
  if (req.session.currentUser) {
    try {
      const data = await RequestModel.find({
        receiver: req.session.currentUser._id,
      }).populate("sender", "_id fullName avatarUrl");
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
  }
});



module.exports = friendRouter;
