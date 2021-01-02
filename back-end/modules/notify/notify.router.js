const express = require('express');
const NotifyModel = require('./notify.model');

const notifyRouter = express.Router();

notifyRouter.get('/get_notify', (req, res) => {
    NotifyModel.find({_userId: req.session.currentUser._id}, (err, data) => {
        if(err){
            res.status(500).json({
                success: false,
                message: err.message,
            })
        } else {
            res.status(200).json({
                success: true,
                data: data
            })
        }
    })
})

module.exports = notifyRouter