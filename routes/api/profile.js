const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');

//Load User and Profile Model
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//@route  /api/profile/test
//@desc   Test profile url connection
//@access PUBLIC
router.get('/test', (req, res) => {
	res.send('test from profile.');
});

//@route  /api/profile
//@desc   Get User profile
//@access PRIVATE
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	const errors = {};
	Profile.findOne({ user: req.user.id })
		.then((profile) => {
			if (!profile) {
				errors.noprofile = 'No profile been created.';
				return res.status(404).json(errors);
			}
			res.json(profile);
		})
		.catch((err) => console.log(err));
});

module.exports = router;
