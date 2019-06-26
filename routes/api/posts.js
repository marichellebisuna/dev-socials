const express = require('express');
const router = express.Router();

//@route  /api/posts
//@desc   Test posts url connection
//@access PUBLIC
router.get('/test', (req, res) => {
	res.send('test from posts.');
});

module.exports = router;
