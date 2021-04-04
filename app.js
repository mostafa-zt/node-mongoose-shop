const express = require('express');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);
const bcrypt = require('bcryptjs');
// for avoiding Cross-Site Request Forgery
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
// const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');

const config = require('./config/config').get(process.env.NODE_ENV);
const errorsController = require('./controllers/error');
const utility = require('./util/utility');
const User = require('./models/user');

const adminRouts = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRootes = require('./routes/auth');

const MONGODB_URI = config.DATABASE;
const csrfProtection = csrf();
const app = express();

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});
// const fileStorage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, 'images');
//     },
//     filename: (req, file, callback) => {
//         callback(null, utility.createGuid().substr(0, 16) + '-' + file.originalname);
//     }
// });
// const fileFilter = (req, file, callback) => {
//     if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
//         callback(null, true);
//     }
//     else {
//         callback(null, false);
//     }
// }

// app.use(helmet());
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(multer().single('file'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(session({ secret: config.SECRET, resave: false, saveUninitialized: false, store: store }));
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    if (!req.session || !req.session.user) {
        res.locals.cartQuantity = 0;
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                req.user = null;
                res.locals.cartQuantity = 0;
                res.locals.isAdmin = null;
                return next();
            }
            req.user = user;
            res.locals.isAdmin = req.user.isAdmin;
            res.locals.cartQuantity = user.cart.cartItems ? user.cart.cartItems.length : 0;
            next();
        })
        .catch(err => console.log(err))
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});
app.use('/admin', adminRouts);
app.use(shopRoutes);
app.use(authRootes);
app.use('/500', errorsController.getError500);
app.use(errorsController.getError404);
app.use((error, req, res, next) => {
    console.log(error);
    res.redirect('/500');
    // return next();
});

app.set('view engine', 'ejs');
app.set('views', 'views');

mongoose.connect(MONGODB_URI)
    .then(result => {
        User.findOne({ userEmail: 'admin@web.com' }).then(user => {
            if (!user) {
                return bcrypt.hash('123456', 6)
                    .then(hashedPass => {
                        const user = new User({
                            userName: 'admin',
                            userEmail: 'admin@web.com',
                            userPassword: hashedPass,
                            isAdmin: true,
                            cart: {
                                cartItems: []
                            }
                        });
                        return user.save();
                    }).then(user => {
                        app.listen(process.env.PORT || 3000);
                    })
            }
            app.listen(process.env.PORT || 3000);
        })
    })
    .catch(err => {
        console.log(err);
    });