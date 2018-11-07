const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

//  User registration
router.post("/signup", (req, res, next) => {
  //  Validate data
  const { email, password } = req.body;
  if (email && password) {
    if (email.length > 0 && password.length > 0) {
      User.find({ email })
        .exec()
        .then(user => {
          if (user && user.length > 0) {
            return res.status(409).json({
              message: "Email exists"
            });
          } else {
            const salt_rounds = 10;
            bcrypt.hash(password, salt_rounds, (err, hash) => {
              if (err) {
                return res.status(500).json({
                  error: err
                });
              } else {
                const user = new User({
                  _id: new mongoose.Types.ObjectId(),
                  email,
                  password: hash
                });
                user
                  .save()
                  .then(result => {
                    res.status(201).json({
                      message: "User created"
                    });
                  })
                  .catch(err => {
                    res.status(500).json({
                      error: err
                    });
                  });
              }
            });
          }
        });
    } else {
      res.status(400).json("Invalid data");
    }
  } else {
    res.status(400).json("Invalid data");
  }
});

//  User login
router.post("/login", (req, res, next) => {
  //  Validate data
  const { email, password } = req.body;
  if (email && password) {
    if (email.length > 0 && password.length > 0) {
      //  Valid data
      User.find({ email })
        .exec()
        .then(user => {
          if (user && user.length < 1) {
            //  No valid email
            return res.status(401).json({
              message: "Auth failed"
            });
          } else {
            //  Valid email
            bcrypt.compare(password, user[0].password, (err, result) => {
              if (err) {
                //  Bcrypt error
                return res.status(401).json({
                  message: "Auth failed"
                });
              } else {
                //  Bcrypt ok
                if (result) {
                  const token = jwt.sign(
                    {
                      email: user[0].email,
                      userId: user[0]._id
                    },
                    process.env.JWT_KEY,
                    {
                      expiresIn: "1h"
                    }
                  );
                  return res.status(200).json({
                    message: "Auth successful",
                    token: token
                  });
                } else {
                  //  Invalid password
                  res.status(401).json({
                    message: "Auth failed"
                  });
                }
              }
            });
          }
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
    } else {
      //  Invalid data
      res.status(400).json("Invalid data");
    }
  } else {
    //  No data submitted
    res.status(400).json("Invalid data");
  }
});
//  User deletion
router.delete("/:userID", (req, res, next) => {
  const userID = req.params.userID;
  //  Validate data
  if (userID) {
    if (userID.length > 0) {
      //  Valid data
      User.deleteOne({ _id: userID })
        .exec()
        .then(result => {
          if (result.n > 0) {
            res.status(200).json("User deleted");
          } else
            res.status(404).json({
              error: "Could not delete user"
            });
        })
        .catch(err => {
          res.status(500).json({
            error: "Could not remove user"
          });
        });
    } else {
      //  Invalid data
      res.status(400).json({
        error: "Invalid user ID"
      });
    }
  } else {
    //  No data submitted
    res.status(400).json({
      error: "No user ID submitted"
    });
  }
});

module.exports = router;
