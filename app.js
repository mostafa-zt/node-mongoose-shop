// const http = require('http');
// const routes = require('./routes');
const bcrypt = require('bcryptjs');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
// const expressHBs = require('express-handlebars');
const errorsController = require('./controllers/error');
const utility = require('./util/utility');
// const sequelize = require('./util/database');
// const Product = require('./models/product');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cartItem');


// const test =express.static((path.join(__dirname, 'config.env')));
// const dotenv = require('dotenv').config({ path: test});


const adminRouts = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRootes = require('./routes/auth');

// const routeDir = require('./util/path');
// const product = require('./models/product');


// const mongoDB = require('./util/database');

const mongoose = require('mongoose');
const User = require('./models/user');

// const user = require('./models/user');

// const mongoConnect = require('./util/database').mongoConnect;
// const getDb = require('./util/database').getDb;

const app = express();
const store = new MongoDBStore({
    uri: 'mongodb+srv://mostafa:LUjiZggnXA6agN2f@cluster0.wvo17.mongodb.net/shop?retryWrites=true&w=majority',
    collection: 'sessions'
});


const csrfProtection = csrf();


const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        callback(null, utility.createGuid().substr(0, 16) + '-' + file.originalname);
    }
});
const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        callback(null, true);
    }
    else {
        callback(null, false);
    }
}

// app.use((req, res, next) => {
//     User.findById('5fd6452fce67802e6019daf4')
//         .then(user => {
//             // req.user = user;
//             req.cart = user.cart.cartItems ? user.cart.cartItems.length : 0;
//             req.session.user = user
//             next();
//         })
//         .catch(err => console.log(err))
//     // next();
// });

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('file'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }));
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
                return next();
            }
            req.user = user;
            // req.cart = user.cart.cartItems ? user.cart.cartItems.length : 0;
            res.locals.cartQuantity = user.cart.cartItems ? user.cart.cartItems.length : 0;
            next();
        })
        .catch(err => console.log(err))
});


app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use('/admin', adminRouts);
app.use(shopRoutes);
app.use(authRootes);

app.set('view engine', 'ejs');
app.set('views', 'views');



app.use('/500', errorsController.getError500);
app.use(errorsController.getError404);

// app.use((error, req, res, next) => {
//     res.redirect('/500');
//     // return next();
// })


mongoose.connect('mongodb+srv://mostafa:LUjiZggnXA6agN2f@cluster0.wvo17.mongodb.net/shop?retryWrites=true&w=majority')
    .then(result => {
        User.findOne({ userEmail: 'mostafa.zj@gmail.com' }).then(user => {
            if (!user) {
                return bcrypt.hash('123456', 6)
                    .then(hashedPass => {
                        const user = new User({
                            userName: 'mostafa',
                            userEmail: 'mostafa.zj@gmail.com',
                            userPassword: hashedPass,
                            cart: {
                                cartItems: []
                            }
                        });
                        return user.save();
                    }).then(user => {
                        console.log(`user Created ... ${user}`);
                        // app.listen(3000);
                    })
            }
            app.listen(process.env.PORT || 3000);
        })
    })
    .catch(err => {
        console.log(err);
    });

// mongoConnect(() => {
//     const db = getDb();
//     const collection = db.collection("users");
//     collection.find().toArray().then(users => {
//         console.log(`users = ${users}`);
//         if (users.length <= 0) {
//             const user = new User('mostafa.zartaj@gmail.com', 'mostafa', { cartItem: [] }, null);
//             collection.insertOne(user).then(result => {
//                 console.log(`user inserted! = ${result}`);
//             });
//         }
//     })
//     app.listen(3000);
// });