const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const expressSession = require("express-session");
const authRouter = require("./modules/auth/routes.js");
const uploadRouter = require("./modules/uploads/router.js");
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
      expressSession({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
      })
    );
    server.use(express.static("public"));

    
    // API
    server.use("/api/users", authRouter);
    server.use("/api/uploads", uploadRouter);

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
