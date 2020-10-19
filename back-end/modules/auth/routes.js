const express = require('express');
const joi = require('@hapi/joi');
const UsersModel = require('../users/users.model');
const bcryptjs = require('bcryptjs');
const session = require('express-session');

// router
const authRouter = express.Router();

authRouter.get('/get-current-user', (req, res) => {
  if(req.session.currentUser){
    res.status(200).json({
      success: true,
      data: {
        _id: req.session.currentUser._id,
        email: req.session.currentUser.email
      },
    });
  } else {
    res.status(200).json({
      success: false,
      message: 'Curent user not found',
    })
  }
  
});

authRouter.post('/register', async (req, res) => {
  // validate
  const bodyValidation = joi.object({
    email: joi.string()
      .required()
      .pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)
      .error(() => {
        return new Error('Invalid email address');
      }),
    password: joi.string()
      .required()
      .pattern(/^[a-zA-Z0-9]{6,30}$/)
      .error(() => {
        return new Error('Passsword only allow alphanumeric, at least 6 characters');
      }),
    fullName: joi.string()
      .required()
      .min(2)
      .max(100)
      .error(() => {
        return new Error('Fullname at least 2 characters');
      }),
      confirmPassword: joi.any().valid(joi.ref('password'))
      .required()
      .error(() => {
        return new Error('The password is not the same!')
      }),
  });
  const validateResult = bodyValidation.validate(req.body);
  if (validateResult.error) {
    res.status(400).json({
      success: false,
      message: validateResult.error.message,
    });
  }
  const existedEmail = await UsersModel.findOne({email: req.body.email}).lean();
  if (existedEmail) {
    res.status(400).json({
      success: false,
      message: 'Email has been used',
    });
  }

  // hash password
  const hashPassword = bcryptjs.hashSync(req.body.password);

  // save to db
  const newUser = {
    email: req.body.email,
    fullName: req.body.fullName,
    password: hashPassword,
  };
  await UsersModel.create(newUser);
  res.status(201).json({
    success: true,
  });
});

authRouter.post('/login', async (req, res) => {
  try {
    // check account
    const existedEmail = await UsersModel.findOne({email: req.body.email}).lean();
    if (!existedEmail) {
      res.status(400).json({
        success: false,
        message: 'Email didnt exists',
      });
    } else {
      // compare password
      const comparePasswordResult = bcryptjs.compareSync(req.body.password, existedEmail.password);
      if (!comparePasswordResult) {
        res.status(400).json({
          success: false,
          message: 'Wrong password',
        });
      } else {
        // session storage
        req.session.currentUser = {
          _id: existedEmail._id,
          email: existedEmail.email,
        };

        res.status(200).json({
          success: true,
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
 
authRouter.get('/logout', (req, res) => {
  req.session.destroy();
  res.status(200).json({
    success: true,
  });
});

module.exports = authRouter;