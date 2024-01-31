const express = require('express');
const router = express.Router();
const passport = require('passport');

const Recaptcha = require('express-recaptcha').RecaptchaV2;
const recaptcha = new Recaptcha(process.env.RECAPTCHA_KEY_1, process.env.RECAPTCHA_KEY_2);

const { getHashedPassword, randomText } = require('../lib/function');
const { checkUsername, addUser } = require('../database/db');
const { notAuthenticated, captchaLogin, captchaRegister } = require('../middlewares');

router.get('/login', notAuthenticated, recaptcha.middleware.render, (req, res) => {
	res.render('login', {
		recaptcha: res.recaptcha,
		layout: 'layout/auth',
	});
});

router.post('/login', recaptcha.middleware.verify, captchaLogin, async (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/dashboard',
		failureRedirect: '/auth/login',
		failureFlash: true,
	})(req, res, next);
});

router.get('/register', notAuthenticated, recaptcha.middleware.render, (req, res) => {
	res.render('register', {
		recaptcha: res.recaptcha,
		layout: 'layout/auth',
	});
});

router.post('/register', recaptcha.middleware.verify, captchaRegister, async (req, res) => {
	try {
		const { username, password, confirmPassword } = req.body;
		if (password.length < 6 || confirmPassword < 6) {
			req.flash('error_msg', 'Password must be at least 6 characters');
			return res.redirect('/auth/register');
		}

		if (password === confirmPassword) {
			const checking = await checkUsername(username);
			if (checking) {
				req.flash('error_msg', 'A user with the same Username already exists');
				return res.redirect('/auth/register');
			}

			const hashedPassword = getHashedPassword(password);
			const apikey = randomText(8);
			addUser(username, hashedPassword, apikey);
			req.flash('success_msg', 'You are now registered and can login');
			return res.redirect('/auth/login');
		}

		req.flash('error_msg', 'Password does not match.');
		return res.redirect('/auth/register');
	} catch (err) {
		console.log(err);
	}
});

router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success_msg', 'logout success');
	res.redirect('/auth/login');
});

module.exports = router;
