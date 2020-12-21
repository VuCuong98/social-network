const express = require("express");
const FriendModel = require("./friend.model");
const RequestModel = require("./request.model");

const friendRouter = express.Router();

friendRouter.post("/add-friend", async (req, res) => {
  if (req.session.currentUser) {
    const newRequest = {
      sender: req.session.currentUser._id,
      receiver: req.body.receiver,
    };
    await RequestModel.create(newRequest, (err, data) => {
      if (err) {
        res.status(500).json({
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
  }
});

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
          (error, sender) => {
            if (error) {
              res.status(400).json({
                success: false,
                message: "Bad request",
              });
            } else {
              res.status(200).json({
                success: true,
                receiver: receiver,
                sender: sender,
              });
            }
          }
        );
      }
    }
  );
});

friendRouter.get('/', async (req, res) => {
    if(req.session.currentUser){
        try{
           const data = await FriendModel.findOne({ _userId :req.session.currentUser._id}).populate("friends", "fullName _id avatarUrl")
           console.log(data);;
           res.status(200).json({
               success: true,
               data: data
           })

       } catch(err) {
           res.status(500).json({
               success: false,
               message: err.message
           })
       }
    }
})

module.exports = friendRouter;
