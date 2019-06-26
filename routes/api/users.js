const express = require('express');
const router = express.Router();

//@route  /api/users
//@desc   Test users url connection
//@access PUBLIC
router.get('/test', (req, res) => {
	res.send('test from users.');
});

module.exports = router;
