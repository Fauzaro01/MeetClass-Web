module.exports = {
    checkRole: function (role) {
        return (req, res, next) => {
            if (req.user.role === role) {
                next();
            } else {
                res.status(403).json({ message: 'Access denied' });
            }
        };
    },
    isAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Please login to continue');
        res.redirect('/auth/login');
    },
    notAuthenticated: function (req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        res.redirect('/dashboard');
    },
    captchaRegister: function (req, res, next) {
        if (req.recaptcha.error) {
            req.flash('error_msg', 'reCAPTCHA Incorrect');
            res.redirect('/auth/register');
        } else {
            return next();
        }
    },
    captchaLogin: function (req, res, next) {
        if (req.recaptcha.error) {
            req.flash('error_msg', 'reCAPTCHA Incorrect');
            res.redirect('/auth/login');
        } else {
            return next();
        }
    },
};
