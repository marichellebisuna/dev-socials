const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

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
//@desc   Test users url connection
//@access PUBLIC

router.post('/register', (req, res) => {
	User.findOne({ email: req.body.email })
		.then((user) => {
			if (user) {
				res.json({ email: 'Email already exist.' }).status(400);
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
