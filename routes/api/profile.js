// Profile Details Location, Bio, Experiences,
const express = require('express');
const router = express.Router();

//@route    GET /api/Profile/test
//@desc     Tests Profile Route
//@access   Public
router.get('/test', (req, res) => res.json({
  msg: 'Profile Works!'
}));

module.exports = router;