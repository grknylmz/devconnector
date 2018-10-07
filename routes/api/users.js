// Authentication, Login, Logout
const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
// Load User Model
const User = require('../../models/User');


//@route      GET /api/users/test
//@desc       Tests Users Route
//@access     Public
router.get('/test', (req, res) => res.json({
  msg: 'Users Works!'
}));


//@route      POST /api/users/register
//@desc       Register Users
//@access     Public
router.post('/register', (req, res) => {
  User.findOne({
    email: req.body.email
  }).then(user => {
    if (user) {
      return res.status(400).json({
        email: 'Email already exists'
      });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200', //Size
        r: 'pg', //Rating 
        d: '404' //Default
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
          newUser.save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        })
      })
    }
  })
});


module.exports = router;