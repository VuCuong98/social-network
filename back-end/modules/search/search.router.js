const express = require("express");
const FriendModel = require("../friend/friend.model");

const searchRouter = express.Router();

searchRouter.post("/search_friend", (req, res) => {
    FriendModel.find({$text: {$search: req.body.searchString}}, (err, data) => {
        if(err){
            res.status(500).json({
                success: false,
                message: err.message
            })
        } else {
            res.status(200).json({
                success: true,
                data: data,
            })
        }
    })
})

module.exports = searchRouter;