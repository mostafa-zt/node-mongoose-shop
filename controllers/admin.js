// const { where } = require('sequelize');
const { Error } = require('sequelize');
const Product = require('../models/product');
const utility = require('../util/utility');
const path = require('path');
// const utility = require('../util/utility');

const { check, validationResult, body } = require('express-validator');

exports.getAddProduct = (req, res, next) => {
    const cartQuantity = req.cart;
    res.render('admin/add-product', {
        pageTitle: 'ADMIN - Add Product',
        path: '/admin/add-product/',
        errorMessages: [],
        // cartQuantity: cartQuantity
    });
};
exports.postAddProduct = (req, res, next) => {
    const user = req.user;
    const productTitle = req.body.productTitle;
    const productPrice = utility.formatMoney(req.body.productPrice);
    const productAuthor = req.body.productAuthor;
    const productDescription = req.body.productDescription;
    const image = req.file;

    let errors = validationResult(req).array();

    if (!image) {
        errors.push({
            value: '',
            msg: 'image input in not valid!',
            param: 'file',
            location: 'body'
        });
        return res.status(422).render('admin/add-product', {
            // products: result,
            pageTitle: 'ADMIN - Add Product',
            path: 'admin/add-product',
            errorMessages: errors,
            oldInputes: {
                // email: email,
                // password: password,
                // confirmPassword: confirmPassword
            },
            // cartQuantity: cartQuantity
        });
    }


    // const product = new Product(productTitle, productPrice, productAuthor, productDescription, productImageUrl, null, user._id);


    if (errors.length > 0) {
        console.log(errors.array());
        return res.status(422).render('admin/add-product', {
            // products: result,
            pageTitle: 'ADMIN - Add Product',
            path: 'admin/add-product',
            errorMessages: errors.array(),
            oldInputes: {
                // email: email,
                // password: password,
                // confirmPassword: confirmPassword
            },
            // cartQuantity: cartQuantity
        });
    }


    const imageUrl = path.join('/', image.path);
    const product = new Product(
        {
            productTitle: productTitle,
            productPrice: productPrice,
            productAuthor: productAuthor,
            productDescription: productDescription,
            productImageUrl: imageUrl,
            user: user._id
        });
    product.save()
        .then(result => {
            console.log(`add new one save = ${result}`);
            res.redirect('/admin/products/');
        }).catch(err => {
            // return res.status(500).render('admin/add-product', {
            //     // products: result,
            //     pageTitle: 'Login',
            //     path: '/signup/',
            //     errorMessages: errors.array(),
            //     oldInputes: {
            //         // email: email,
            //         // password: password,
            //         // confirmPassword: confirmPassword
            //     },
            //     // cartQuantity: cartQuantity
            // });
            // res.redirect('/500');
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    // .add().then(() => {
    //     res.redirect('/admin/products/');
    // });
};
exports.getEditProduct = (req, res, next) => {
    const cartQuantity = req.cart;
    const productId = req.params.productId;
    Product.findById(productId).then(product => {
        res.render('admin/edit-product', {
            product: product,
            pageTitle: `ADMIN - Edit Product ${product.productTitle}`,
            path: '/admin/products/',
            errorMessages: [],
            // cartQuantity: cartQuantity
        });
    })
}
exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;
    const productTitle = req.body.productTitle;
    const productPrice = utility.formatMoney(req.body.productPrice);
    const productAuthor = req.body.productAuthor;
    const productDescription = req.body.productDescription;
    const image = req.file;

    let errors = validationResult(req).array();

    // if (!image) {
    //     errors.push({
    //         value: '',
    //         msg: 'image input in not valid!',
    //         param: 'file',
    //         location: 'body'
    //     });
    //     return res.status(422).render('admin/add-product', {
    //         // products: result,
    //         pageTitle: 'ADMIN - Edit Product',
    //         path: 'admin/edit-product',
    //         errorMessages: errors,
    //         oldInputes: {
    //             // email: email,
    //             // password: password,
    //             // confirmPassword: confirmPassword
    //         },
    //         // cartQuantity: cartQuantity
    //     });
    // }
    // const product = new Product(productTitle, productPrice, productAuthor, productDescription, productImageUrl, productId);
    Product.findById(productId)
        .then(product => {
            product.productTitle = productTitle;
            product.productPrice = productPrice;
            product.productDescription = productDescription;
            if (image) {
                utility.deleteFile(product.productImageUrl);
                const imageUrl = path.join('/', image.path);
                product.productImageUrl = imageUrl;
            }
            return product.save();
        }).then(result => {
            console.log(`This Product Updated! =  ${result}`);
            res.redirect('/admin/products/');
        })
        .catch(err => {
            console.log(err);
        });
};
exports.getProductList = (req, res, next) => {
    const cartQuantity = req.cart;
    Product.find()
        // .populate('userId')
        .then(result => {
            res.render('admin/products', {
                products: result,
                pageTitle: 'ADMIN - Product List',
                path: '/admin/products/',
                // cartQuantity: cartQuantity
            });
        }).catch(err => console.log(err));
};
exports.postRemoveProduct = (req, res, next) => {
    const productId = req.params.productId;
    // let filePath;
    Product.findById(productId)
        .then(product => {
            // filePath = product.productImageUrl
            return product.remove();
        })
        .then(result => {
            utility.deleteFile(result.productImageUrl);
            console.log(`product has been deleted = ${result}`);
            res.status(200).json({ success: true });
        })
    // Product.findByIdAndRemove(productId)
    //     .then(result => {
    //         console.log(`product has been deleted = ${result}`);
    //         res.json({ success: true });
    //     })
        .catch(err => console.log(err));
};


