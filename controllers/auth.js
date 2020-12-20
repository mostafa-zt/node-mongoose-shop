
const bcrypt = require('bcryptjs');
const { request } = require('express');

const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const Product = require('../models/product');
const User = require('../models/user');
const utility = require('../util/utility');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

// const transporter = nodemailer.createTransport(sendgridTransport({
//     auth: {
//         // api_user: 'mostafa.zartaj@gmail.com',
//         api_key: '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'
//     }
// }));

const { check, validationResult, body } = require('express-validator');

exports.getsignup = (req, res, next) => {
    const cartQuantity = req.cart;
    console.log(req.session.isLoggedIn);
    res.render('auth/signup', {
        // products: result,
        pageTitle: 'Login',
        path: '/signup/',
        errorMessages: [],
        oldInputes: {
            email: null,
            password: null,
            confirmPassword: null
        }
        // cartQuantity: cartQuantity
    });
};

exports.postsignup = (req, res, next) => {
    // const cartQuantity = req.cart;
    // res.setHeader('Set-Cookie', 'LoggedIn=true ; HttpOnly');
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('auth/signup', {
            // products: result,
            pageTitle: 'Login',
            path: '/signup/',
            errorMessages: errors.array(),
            oldInputes: {
                email: email,
                password: password,
                confirmPassword: confirmPassword
            },
            // cartQuantity: cartQuantity
        });
    }


    bcrypt.hash(password, 6)
        .then(hashedPass => {
            const user = new User({
                userEmail: email,
                userPassword: hashedPass,
                cart: { cartItems: [] }
            });
            return user.save();
        })
        .then(user => {
            console.log(`user created... ${user}`);
            res.redirect('/login/');

            // return transporter.sendMail({
            //     to: email,
            //     from: 'mostafazartaj@aol.com',
            //     subject: 'Nodejs-Shop - Created User Successfully!',
            //     html: '<h1>Created User Successfully!</h1>'
            // });

            const msg = {
                to: email,
                from: 'mostafazartaj@aol.com',
                subject: 'Sending with SendGrid is Fun',
                text: 'and easy to do anywhere, even with Node.js',
                html: '<h1>Created User Successfully!</h1>'
            };
            return sgMail.send(msg);

            // return nodemailer.createTestAccount();



        })
        // .then(account => {
        //     // create reusable transporter object using the default SMTP transport
        //     let transporter = nodemailer.createTransport({
        //         host: "smtp.ethereal.email",
        //         port: 587,
        //         secure: false, // true for 465, false for other ports
        //         auth: {
        //             user: account.user, // generated ethereal user
        //             pass: account.pass, // generated ethereal password
        //         },
        //     });

        //     // send mail with defined transport object
        //     return transporter.sendMail({
        //         from: '"Fred Foo 👻" <foo@example.com>', // sender address
        //         to: email, // list of receivers
        //         subject: "Hello ✔", // Subject line
        //         text: "Hello world?", // plain text body
        //         html: "<b>Hello world?</b>", // html body
        //     });


        // })
        // .then(info => {
        //     console.log("Message sent: %s", info.messageId);
        //     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        //     // Preview only available when sending through an Ethereal account
        //     console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        //     // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

        // })
        .then(resultEmail => {
            console.log(resultEmail);
        })
        // })
        .catch(err => console.log(err))
};

exports.getLogin = (req, res, next) => {
    const cartQuantity = req.cart;
    // console.log(req.get('Cookie'));
    console.log(req.session.isLoggedIn);
    // const sss = req.flash('error')
    res.render('auth/login', {
        // products: result,
        pageTitle: 'Login',
        path: '/login/',
        errorMsg: req.flash('error')
        // cartQuantity: cartQuantity,
        // csrfToken: req.csrfToken()
    });
};

exports.postLogin = (req, res, next) => {
    // const cartQuantity = req.cart;
    // res.setHeader('Set-Cookie', 'LoggedIn=true ; HttpOnly');
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ userEmail: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'invalid username or pass');
                return res.redirect('/login/');
            }
            bcrypt.compare(password, user.userPassword)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save((result) => {
                            console.log(`LoggedIn...`);
                            res.redirect('/');
                        });
                    }
                    req.flash('error', 'invalid username or pass');
                    res.redirect('/login/');
                }).catch(err => console.log(err))
        })
        .catch(err => console.log(err))
};
exports.getlogout = (req, res, next) => {
    // const cartQuantity = req.cart;
    // res.setHeader('Set-Cookie', 'LoggedIn=true ; HttpOnly');
    req.session.destroy(() => {
        res.redirect('/');
    });
    // req.session.isLoggedIn = true;
    // console.log(`LoggedIn...`);
};