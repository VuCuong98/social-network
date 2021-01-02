const express = require("express");

const MessageModel = require("./message.model");

const messageRouter = express.Router();

messageRouter.get("/get-message", (req, res) => {
  if(req.session.currentUser){
    MessageModel.find({members: {$in: [req.session.currentUser._id]}}, (err, data) => {
      if(err){
        res.status(500),json({
          success: false,
          err: err.message,
        })
      } else {
        res.status(200).json({
          success: true,
          data: data,
        })
      }
    }).populate("members", "_id fullName avatarUrl").populate("conversation.user", "_id avatarUrl fullName");
  }
});

messageRouter.post("/send-message", async (req, res) => {
  if (req.session.currentUser) {
    const messagesData = await MessageModel.find({
      members: {
        $all: [`${req.session.currentUser._id}`, `${req.body.memberId}`],
      },
    });
    console.log(messagesData);
    if (!messagesData.length) {
      console.log(" say hi");
      const newConversation = {
        members: [req.session.currentUser._id, req.body.memberId],
        conversation: [
          { user: req.session.currentUser._id, message: req.body.message },
        ],
      };
      // console.log(newMessage);

      MessageModel.create(newConversation, (err, data) => {
        if (err) {
          res.json({
            success: false,
            message: err.message,
          });
        } else {
          res.json({
            success: true,
            data: data,
          });
        }
      });
    } else {
      const newMessage = {
        user: req.session.currentUser._id,
        message: req.body.message,
      };
      MessageModel.findOneAndUpdate(
        {
          members: {
            $all: [`${req.session.currentUser._id}`, `${req.body.memberId}`],
          },
        },
        { $push: { conversation: newMessage } }, {new: true}, (err, data)=>{
            res.status(200).json({
                success: true,
                data: data,
            })
        }
      ).populate("members").populate("conversation.user");
    }
  }
});

module.exports = messageRouter;
