const path = require('path');
const { check, validationResult, body } = require('express-validator');
const Product = require('../models/product');
const utility = require('../util/utility');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: 'ADMIN - Add Product',
        path: '/admin/add-product/',
        errorMessages: [],
        oldInputes: {
            productTitle: null,
            productPrice: null,
            productDescription: null,
        },
    });
};
exports.postAddProduct = (req, res, next) => {
    const user = req.user;
    const productTitle = req.body.productTitle;
    const productPrice = req.body.productPrice ? utility.formatMoney(req.body.productPrice) : null;
    const productDescription = req.body.productDescription;
    const image = req.file;

    let errors = validationResult(req).array();
    if (!image) {
        errors.push({
            value: '',
            msg: 'Image is not valid!',
            param: 'file',
            location: 'body'
        });
        return res.status(422).render('admin/add-product', {
            pageTitle: 'ADMIN - Add Product',
            path: 'admin/add-product',
            errorMessages: errors,
            oldInputes: {
                productTitle: productTitle,
                productPrice: productPrice,
                productDescription: productDescription,
            },
        });
    }
    if (errors.length > 0) {
        return res.status(422).render('admin/add-product', {
            pageTitle: 'ADMIN - Add Product',
            path: 'admin/add-product',
            errorMessages: errors,
            oldInputes: {
                productTitle: productTitle,
                productPrice: productPrice,
                productDescription: productDescription,
            },
        });
    }

    const imageUrl = path.join('/', image.path);
    const product = new Product(
        {
            productTitle: productTitle,
            productPrice: productPrice,
            productDescription: productDescription,
            productImageUrl: imageUrl,
            user: user._id
        });
    product.save()
        .then(result => {
            res.redirect('/admin/products/');
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};
exports.getEditProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId).then(product => {
        res.render('admin/edit-product', {
            // product: product,
            pageTitle: `ADMIN - Edit Product ${product.productTitle}`,
            path: '/admin/products/',
            errorMessages: [],
            oldInputes: {
                productTitle: product.productTitle,
                productPrice: product.productPrice,
                productDescription: product.productDescription,
                _id: product._id
            },
        });
    })
}
exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;
    const productTitle = req.body.productTitle;
    const productPrice = req.body.productPrice ? utility.formatMoney(req.body.productPrice) : null;
    const productDescription = req.body.productDescription;
    const image = req.file;

    let errors = validationResult(req).array();
    if (errors.length > 0) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'ADMIN - Add Product',
            path: 'admin/add-product',
            errorMessages: errors,
            oldInputes: {
                productTitle: productTitle,
                productPrice: productPrice,
                productDescription: productDescription,
                _id: productId
            },
        });
    }

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
            res.redirect('/admin/products/');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};
exports.getProductList = (req, res, next) => {
    Product.find()
        .then(result => {
            res.render('admin/products', {
                products: result,
                pageTitle: 'ADMIN - Product List',
                path: '/admin/products/',
            });
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};
exports.postRemoveProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .then(product => {
            return product.remove();
        })
        .then(result => {
            utility.deleteFile(result.productImageUrl);
            res.status(200).json({ success: true });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};


