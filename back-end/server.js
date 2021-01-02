const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const authRouter = require("./modules/auth/auth.routes.js");
const uploadRouter = require("./modules/uploads/uploads.routers.js");
const postRouter = require("./modules/posts/posts.routers.js");
const userRouter = require("./modules/users/users.router.js");
const friendRouter = require('./modules/friend/friend.router.js');
const messageRouter = require("./modules/message/message.router.js");
const searchRouter = require("./modules/search/search.router.js");
const notifyRouter = require("./modules/notify/notify.router.js");

mongoose.connect("mongodb://localhost:27017/social-network", (error) => {
  if (error) {
    throw error;
  } else {
    console.log("mongodb connected...");
    const server = express();

    // middlewares
    server.use(
      cors({
        origin: "http://localhost:3000",
        credentials: true,
      })
    );
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(
      session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
      })
    );
    server.use(express.static("public"));

    
    // API
    server.use("/api/auth", authRouter);
    server.use("/api/users", userRouter);
    server.use("/api/uploads", uploadRouter);
    server.use("/api/posts", postRouter);
    server.use("/api/friends", friendRouter);
    server.use("/api/messages", messageRouter);
    server.use("/api/searchs", searchRouter);
    server.use("/api/notify", notifyRouter);
    // start server
    server.listen(3001, (err) => {
      if (err) {
        throw err;
      } else {
        console.log("Server listen on port 3001");
      }
    });
  }
});
