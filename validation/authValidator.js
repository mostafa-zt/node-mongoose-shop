const { check, validationResult, body } = require('express-validator');
const User = require('../models/user');

class AuthValidator {
    static checkSignup() {
        return [
            body('email', 'this email in not valid')
                .isEmail()
                .custom((value, { req }) => {
                    if (value === 'test@test.com' || value === 'test@test.test') {
                        throw new Error('This email address is forbidden! try another vali email address.');
                    }
                    return User.findOne({ userEmail: value })
                        .then(userDoc => {
                            if (userDoc) {
                                return Promise.reject('emails exists already');
                            }
                        });
                })
                .isLowercase().trim().normalizeEmail({ all_lowercase: true, gmail_remove_dots: false  }),
            body('password', 'this password in not valid')
                .isLength({ min: 5, max: 10 })
                .isAlphanumeric().withMessage('pass should be alphabet and number only'),
            body('confirmPassword', 'password is not match!').custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('password is not match!');
                }
                return true;
            }),
        ]
    }
}

module.exports = AuthValidator;