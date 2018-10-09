// Authentication, Login, Logout
const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const config = require('../../config/keys');
// Load User Model
const User = require('../../models/User');
const passport = require('passport');
//@route      GET /api/users/test
//@desc       Tests Users Route
//@access     Public
router.get("/test", (req, res) =>
  res.json({
    msg: "Users Works!"
  })
);

//@route      POST /api/users/register
//@desc       Register Users
//@access     Public
router.post("/register", (req, res) => {
  User.findOne({
    email: req.body.email
  }).then(user => {
    if (user) {
      return res.status(400).json({
        email: "Email already exists"
      });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //Size
        r: "pg", //Rating
        d: "404" //Default
      });

      // Create User Object
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar: avatar,
        date: req.body.date
      });

      bcrypt.genSalt((err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//@route      POST /api/users/login
//@desc       Login User
//@access     Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({
    email: email
  }).then(user => {
    // Check user
    if (!user) {
      return res.status(404).json({
        email: "User not found!"
      });
    }
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //Create Payload
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        }

        jwt.sign(payload, config.secret, {
          expiresIn: 3600
        }, (err, token) => {
          res.json({
            success: true,
            token: 'Bearer ' + token
          })
        });
      } else {
        return res.status(400).json({
          password: "Password is incorrect!"
        });
      }
    });
  });
});


//@route      POST /api/users/current
//@desc       Check Current User
//@access     Private
router.get('/current', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  res.json({
    user: req.user
  })
});



module.exports = router;