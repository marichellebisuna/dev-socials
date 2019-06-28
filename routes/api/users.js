const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//Load Input Validation
const validateRegisterInput = require('../../validation/register');

//Load User model
const User = require('../../models/User');

//@route  /api/users/test
//@desc   Test users url connection
//@access PUBLIC
router.get('/test', (req, res) => {
	res.send('test from users.');
});

module.exports = router;

//@route  /api/users/register
//@desc   User registration
//@access PUBLIC

router.post('/register', (req, res) => {
	const { errors, isValid } = validateRegisterInput(req.body);
	//Check validation
	if (!isValid) {
		return res.status(400).json(errors);
	}

	User.findOne({ email: req.body.email })
		.then((user) => {
			if (user) {
				errors.email = 'Email already exist.';
				res.json(errors).status(400);
			}
			const avatar = gravatar.url(req.body.email, {
				s: '200',
				r: 'pg',
				d: 'mm'
			});
			const newUser = new User({
				name: req.body.name,
				email: req.body.email,
				password: req.body.password,
				avatar
			});
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newUser.password, salt, (err, hash) => {
					if (err) throw err;
					newUser.password = hash;
					newUser.save().then((user) => res.json(user)).catch((err) => console.log(err));
				});
			});
		})
		.catch((err) => console.log(err));
});
//@route  /api/users/login
//@desc   User login with token
//@access PUBLIC

router.post('/login', (req, res) => {
	User.findOne({ email: req.body.email }).then((user) => {
		//Check User
		if (!user) {
			errors.email = 'User not found.';
			res.status(400).json(errors);
		}

		//Check Password
		bcrypt
			.compare(req.body.password, user.password)
			.then((isMatch) => {
				if (isMatch) {
					//User matched
					const payload = { id: user.id, name: user.name, email: user.email, avatar: user.avatar };
					//Assign token to user
					jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
						res.json({
							success: true,
							token: 'Bearer ' + token
						});
					});
				} else {
					errors.password = 'Password incorrect.';
					return res.status(404).json(errors);
				}
			})
			.catch((err) => console.log(err));
	});
});

//@route  /api/users/current
//@desc   Return current user
//@access PRIVATE

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
	res.json({
		id: req.user.id,
		name: req.user.name,
		avatar: req.user.avatar,
		email: req.user.email
	});
});
