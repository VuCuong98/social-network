const express = require("express");
const joi = require("@hapi/joi");
const UsersModel = require("../users/users.model");
const TokenModel = require("../users/token.model");
const NotifyModel = require("../notify/notify.model");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const session = require("express-session");
const { getMaxListeners } = require("../users/users.model");
const FriendModel = require("../friend/friend.model");
require("dotenv").config();

// router
const authRouter = express.Router();
// Get Current User
authRouter.get("/get-current-user", async (req, res) => {
  if (req.session.currentUser) {
    console.log(req.session.currentUser);
    const data = await UsersModel.findById(req.session.currentUser._id).lean();
    console.log(data);
    res.status(200).json({
      success: true,
      data: data,
      // {
      //   _id: req.session.currentUser._id,
      //   email: req.session.currentUser.email,
      //   fullName: req.session.currentUser.fullName,
      // },
    });
  } else {
    res.status(200).json({
      success: false,
      message: "Curent user not found",
    });
  }
});

// Register Account
authRouter.post("/register", async (req, res) => {
  // validate
  const bodyValidation = joi.object({
    email: joi
      .string()
      .required()
      .pattern(
        /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
      )
      .error(() => {
        return new Error("Địa chỉ email không chính xác!");
      }),
    password: joi
      .string()
      .required()
      .pattern(/^[a-zA-Z0-9]{6,30}$/)
      .error(() => {
        return new Error("Mật khẩu phải ít nhất 6 ký tự!");
      }),
    fullName: joi
      .string()
      .required()
      .min(2)
      .max(100)
      .error(() => {
        return new Error("Tài khoản ít nhất 2 ký tự!");
      }),
    confirmPassword: joi
      .any()
      .valid(joi.ref("password"))
      .required()
      .error(() => {
        return new Error("Mật khẩu không chính xác!");
      }),
  });
  const validateResult = bodyValidation.validate(req.body);
  if (validateResult.error) {
    res.status(400).json({
      success: false,
      message: validateResult.error.message,
    });
  } else {
    var user = await UsersModel.findOne({
      email: req.body.email,
    }).lean();
    if (user) {
      res.status(400).json({
        success: false,
        message: "Email đã được sử dụng!",
      });
    } else {
      // hash password
      const hashPassword = bcryptjs.hashSync(req.body.password);
  
      // save to db
      const newUser = {
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        backgroundUrl: req.body.backgroundUrl,
        description: req.body.description,
        password: hashPassword,
        confirmPassword: req.body.confirmPassword,
      };
      // await UsersModel.create(newUser);
      user = new UsersModel(newUser);
      user.save((err) => {
        if (err) {
          return res.status(500).send({ message: err.message });
        } else {
          // create notify
          NotifyModel.create({
            _userId: user._id,
            type:'',
          })
          // create list friend
          FriendModel.create({
            _userId: user._id,
            // friends: [],
          })
          // create vertification  token for this user
          var token = new TokenModel({
            _userId: user._id,
            token: crypto.randomBytes(10).toString("hex"),
          });
  
          // save the vertification token
          token.save((err) => {
            if (err) {
              return res.status(500).send({ message: err.message , message: "Loi roi dcmm"});
            } else {
              // send email
              var transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: 'btlweb123@gmail.com',
                  pass: 'Vuvancuong98',
                },
              });
              console.log(user);
  
              var mailOptions = {
                from: "vucun198@gmail.com",
                to: user.email,
                subject: "Mã xác thực tà khoản",
                text:
                  "Xin chào,\n\n" +
                  "Hãy các thực tài khoản của bạn bằng cách nhấn vào đường dẫn: \nhttp://localhost:3000/verify/" +
                  token.token +
                  ".\n",
              };
              transporter.sendMail(mailOptions, (err) => {
                if (err) {
                  res.status(500).json({
                    success: false,
                    message: err.message,
                  });
                } else {
                  console.log("đến đây chưa");
                  res.status(200).json({
                    success: true,
                    message: `Một liên kết xác thực đã được gửi đến: ${user.email}!`,
                  });
                }
              });
            }
          });
        }
      });
    }
  }
});

//  Confirm Token Verified
authRouter.post("/confirmToken", (req, res) => {
  console.log(req.body.token);
  TokenModel.findOne(
    {token: req.body.token },
    (error, token) => {
      if (!token) {
        res.status(400).json({
          success: false,
          message:
            "Chúng tôi không thể tìm thấy mã thông báo hợp lệ. Mã thông báo của bạn có thể đã hết hạn!",
        });
      } else {
        UsersModel.findOne({ _id: token._userId }, (err, user) => {
          if (!user) {
            res.status(400).json({
              success: false,
              message:
                "Chúng tôi không thể tìm thấy tài khoản cho mã thông báo này!",
            });
          } else if (user.isVerified) {
            res.status(400).json({
              success: false,
              message: "Tài khoản của bạn đã được xác thực!",
            });
          } else {
            // Vertify and save the user
            user.isVerified = true;
            user.save((err) => {
              if (err) {
                res.status(500).json({
                  success: false,
                  message: err.message,
                });
              } else {
                res.status(200).json({
                  success: true,
                  message: "Tài khoản đã được xác thực. Đăng nhập ngay!",
                });
              }
            });
          }
        });
      }
    }
  );
});

// ResendToken
authRouter.post("/resendToken", (req, res) => {
   UsersModel.findOne({email: req.body.email}, (err, user) => {
     if(err){
       res.status(500).json({
         success: false,
         message: err.message,
       })
     }
     if(!user){
       res.status(400).json({
         success: false,
         message: "Không tìm thấy email hợp lệ",
       });
     } else if(user.isVerified){
       res.status(400).json({
         success: false,
         message: "Tài khoản của bạn đã được xác thực",
       })
     } else {
      //  create a verification token, save and send email
      var token = new TokenModel({_userId: user._id, token: crypto.randomBytes(10).toString('hex')});
      // save the token
      token.save((error) => {
        if(error){
          res.status(500).json({
            success: false,
            message: error.message,
          })
        } else {
          // send email
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: 'btlweb123@gmail.com',
              pass: 'Vuvancuong98',
            },
          });
          console.log(user);

          var mailOptions = {
            from: "vucun198@gmail.com",
            to: user.email,
            subject: "Mã xác thực tà khoản",
            text:
              "Xin chào,\n\n" +
              "Hãy các thực tài khoản của bạn bằng cách nhấn vào đường dẫn: \nhttp://localhost:3000/verify/" +
              token.token +
              ".\n",
          };
          transporter.sendMail(mailOptions, (err) => {
            if (err) {
              res.status(500).json({
                success: false,
                message: err.message,
              });
            } else {
              res.status(200).json({
                success: true,
                message: `Một liên kết xác thực đã được gửi đến: ${user.email}!`,
              });
            }
          });
        }
      });
     }
   })
})

// Login Account
authRouter.post("/login", async (req, res) => {
  try {
    // check account
    const user = await UsersModel.findOne({
      email: req.body.email,
    }).lean();
    if (!user) {
      res.status(400).json({
        success: false,
        message: "Tài khoản không tồn tại!",
      });
    } else {
      // compare password
      const comparePasswordResult = bcryptjs.compareSync(
        req.body.password,
        user.password
      );
      if (!comparePasswordResult) {
        res.status(400).json({
          success: false,
          message: "Email hoặc mật khẩu không chính xác!",
        });
      }
      // Check account verified
      else if (user.isVerified == false) {
        res.status(400).json({
          success: false,
          message: "tài khoản chưa được xác thực!",
        });
      } else {
        // console.log(user);
        // session storage
        req.session.currentUser = {
          _id: user._id,
          email: user.email,
          fullName: user.fullName,
        };
        console.log(req.session.currentUser);
        res.status(200).json({
          success: true,
          data: user,
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//  Logout
authRouter.get("/logout", (req, res) => {
  req.session.destroy();
  res.status(200).json({
    success: true,
  });
});

module.exports = authRouter;
