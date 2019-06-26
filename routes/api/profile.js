const express = require('express');
const router = express.Router();

//@route  /api/profile
//@desc   Test profile url connection
//@access PUBLIC
router.get('/test', (req, res) => {
	res.send('test from profile.');
});

module.exports = router;
