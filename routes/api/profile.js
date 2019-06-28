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

//@route  /api/profile
//@desc   CREATE or EDIT User profile
//@access PRIVATE
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	const errors = {};
	const profileFields = {};
	profileFields.user = req.user.id;
	if (req.body.handle) profileFields.handle = req.body.handle;
	if (req.body.company) profileFields.company = req.body.company;
	if (req.body.website) profileFields.website = req.body.website;
	if (req.body.location) profileFields.location = req.body.location;
	if (req.body.status) profileFields.status = req.body.status;
	if (req.body.bio) profileFields.bio = req.body.bio;
	if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;

	//Skills -split into array
	if (typeof req.body.skills !== 'undefined') {
		profileFields.skills = req.body.skills.split(',');
	}

	//Social
	profileFields.social = {};
	if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
	if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
	if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
	if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
	if (req.body.facebook) profileFields.social.facebook = req.body.facebook;

	Profile.findOne({ user: req.user.id }).then((profile) => {
		if (profile) {
			//Update if Profile exist
			Profile.findOneAndUpdate({ id: req.user.id }, { $set: profileFields }, { new: true }).then((profile) =>
				res.json(profile)
			);
		} else {
			//Create User profile

			//Check if handle exists
			Profile.findOne({ handle: profileFields.handle }).then((profile) => {
				if (profile) {
					errors.handle = 'That handle already exists';
					res.status(400).json(errors);
				} else {
					//Save Profile
					new Profile(profileFields).save().then((profile) => res.json(profile));
				}
			});
		}
	});
});

module.exports = router;
