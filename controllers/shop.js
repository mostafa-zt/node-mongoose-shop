// const { INTEGER } = require('sequelize');
// const { where } = require('sequelize');
// const Cart = require('../models/cart');
// const CartItem = require('../models/cartItem');
// const { ObjectID, MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const stripe = require('stripe')('sk_test_51HyqDyB64RoBKGh8IU6zHriFpW17QZ7cnLsO8TMaYAiyg74hxdDSD9rKyt0m8xs9wFBbzcnUb0nPWr9Pj3Yan15600PU6kknKB');

const Product = require('../models/product');

const User = require('../models/user');
const Utility = require('../util/utility');
const Order = require('../models/order');
// const OrderItem = require('../models/order').orderItems;


// const { mongoConnect } = require('../util/database');
const utility = require('../util/utility');
const { Error, json } = require('sequelize');
const { default: Stripe } = require('stripe');

const ITEMS_PER_PAGE = 2;
exports.getIndex = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalDocs = 0;
    // const cartQuantity = req.cart;
    Product.countDocuments()
        .then(numberOfDocs => {
            totalDocs = numberOfDocs;
            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
        })
        .then(products => {
            res.render('shop/index', {
                products: products,
                pageTitle: 'Shop - Home Page',
                path: '/',
                totalProducts: totalDocs,
                currenPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalDocs,
                nextPage: page + 1,
                hasPreviousPage: page > 1,
                previousPage: page - 1,
                hasFirstPage: page > 1,
                firstPage: 1,
                hasLastPage: ITEMS_PER_PAGE * page < totalDocs,
                lastPage: Math.ceil(totalDocs / ITEMS_PER_PAGE),
                numberOfPages: Math.ceil(totalDocs / ITEMS_PER_PAGE)
            });
        })
        .catch(err => console.log(err));

};
exports.getProductList = (req, res, next) => {
    const cartQuantity = req.cart;
    Product.findAll().then(result => {
        res.render('shop/product-list', {
            products: result,
            pageTitle: 'Shop - Shop List',
            path: '/product-list/',
            cartQuantity: cartQuantity
        });
    });
};
exports.getCart = (req, res, next) => {

    if (!req.session.isLoggedIn) {
        return res.redirect('/login/');
    }

    const cartQuantity = req.cart;
    const user = req.user;

    let productPriceInQty = 0;
    let totalPriceCart = 0;

    user.populate('cart.cartItems.product')
        .execPopulate()
        .then(user => {
            return user.cart.cartItems.map(cartItem => {
                // const cartItem = this.cart.cartItems.find(item => {
                //     return item.productId.toString() === product._id.toString();
                // });
                productPriceInQty = cartItem.product.productPrice * cartItem.quantity;
                totalPriceCart = totalPriceCart + productPriceInQty;
                return {
                    ...cartItem.product.toObject(), ///...product,
                    // productPro
                    productQuantity: cartItem.quantity,
                    productPriceInQty: utility.formatMoney(productPriceInQty),
                    // totalPriceCart: totalPriceCart
                }
            });
        })
        .then(result => {
            const data = { cartItems: [...result], totalPriceCart: utility.formatMoney(totalPriceCart) };
            // const data = result.push({ totalPriceCart: totalPriceCart });

            return data;
        })
        // .getCart()
        .then(result => {
            res.render('shop/cart', {
                pageTitle: 'Shop - Cart',
                path: '/cart/',
                // cartQuantity: cartQuantity,
                cart: result
            })
        });

    // const userObj = new User(user.email, user.name, user.cart, user._id);

    // userObj.getCart().then(result => {
    //     res.render('shop/cart', {
    //         pageTitle: 'Shop - Cart',
    //         path: '/cart/',
    //         cartQuantity: cartQuantity,
    //         cart: result
    //     })
    // });

    // .then(result => {
    //     res.render('shop/cart', {
    //         pageTitle: 'Shop - Cart',
    //         path: '/cart/',
    //         cartQuantity: cartQuantity,
    //         cart: result
    //     })
    // })
    // .catch(err => console.log(err));

    // user.cart.cartItems.forEach(cartItem => {
    //     const productPrice = cartItem.product.productPrice;
    //     const productQuantity = cartItem.quantity;
    //     const productPriceInQty = productQuantity * productPrice;
    //     totalPrice = totalPrice + productPriceInQty;
    //     data.push({
    //         productPrice: formatMoney(productPrice),
    //         productQuantity: productQuantity,
    //         productPriceInQty: formatMoney(productPriceInQty),
    //         productTitle: cartItem.product.productTitle,
    //         productAuthor: cartItem.product.productAuthor,
    //         cartItemId: cartItem.cartItemId
    //     });
    // })

    // const cart;
    // Cart.findOne({ where: { userId: user._id } })
    //     .then(cart => {
    //         return cart.getCartItems({ include: Product });
    //     })
    //     .then(cartItems => {
    //         console.log(cartItems);
    //         for (let index = 0; index < cartItems.length; index++) {
    //             console.log(cartItems[index]);
    //         };
    //         for (const key in cartItems) {
    //             if (cartItems.hasOwnProperty(key)) {
    //                 const element = cartItems[key];
    //                 console.log(element);
    //             }
    //         }
    //         for (const iterator of cartItems) {
    //             console.log(iterator);
    //         }
    //         let data = [];
    //         let totalPrice = 0;
    //         cartItems.forEach(cartItem => {
    //             const productPrice = cartItem.product.productPrice;
    //             const productQuantity = cartItem.quantity;
    //             const productPriceInQty = productQuantity * productPrice;
    //             totalPrice = totalPrice + productPriceInQty;
    //             data.push({
    //                 productPrice: formatMoney(productPrice),
    //                 productQuantity: productQuantity,
    //                 productPriceInQty: formatMoney(productPriceInQty),
    //                 productTitle: cartItem.product.productTitle,
    //                 productAuthor: cartItem.product.productAuthor,
    //                 cartItemId: cartItem.cartItemId
    //             });
    //         })
    //         //data[data.length-1]
    //         data.push(formatMoney(totalPrice));
    //         res.render('shop/cart', {
    //             pageTitle: 'Shop - Cart',
    //             path: '/cart/',
    //             cartQuantity: cartQuantity,
    //             cart: data
    //         });
    //         // const data = JSON.stringify(cartItems);
    //         // console.log(JSON.stringify(cartItems));
    //     })
    //     .catch(err => console.log(err));
};

exports.getProductDetail = (req, res, next) => {
    const productId = req.params.productId;
    const cartQuantity = req.cart;
    Product.findById(productId).then(result => {
        res.render('shop/product-detail', {
            product: result,
            pageTitle: `Shop - Product Detail ${result.productTitle}`,
            path: '/product-detail/',
            cartQuantity: cartQuantity
        });
    });
};

exports.getDecreaseQty = (req, res, next) => {
    const productId = req.params.productId;
    const user = req.user;

    let productPriceInQty = 0;
    let totalPriceCart = 0;
    let newQty = 0

    user.populate('cart.cartItems.product')
        .execPopulate()
        .then(user => {
            user.cart.cartItems.forEach(cartItem => {
                if (cartItem.product._id.toString() === productId.toString()) {
                    newQty = cartItem.quantity - 1;
                    cartItem.quantity = newQty;
                    productPriceInQty = cartItem.product.productPrice * cartItem.quantity;
                    if (newQty === 0) {
                        cartItem.remove();
                    }
                }
                else {
                    productPriceInQty = cartItem.product.productPrice * cartItem.quantity;
                }
                totalPriceCart = totalPriceCart + productPriceInQty;
            });
            user.markModified('cart.cartItems');
            return user.save();
        })
        .then(user => {
            console.log(user);
            // const cartItem = user.cart.cartItems.find(cartItem => {
            //     return cartItem.product._id.toString() === productId.toString();
            // });
            res.json({
                success: true,
                quantity: newQty,
                cartItemId: productId.toString(),
                newPriceInQty: utility.formatMoney(productPriceInQty),
                totalPrice: utility.formatMoney(totalPriceCart),
                cartQuantity: user.cart.cartItems.filter(d => d.productQuantity !== 0).length
            });
        });
};

// userModel.decreaseQuantityFromCart(productId)
//     .then(() => {
//         return userModel.getCart();
//     }).then(cart => {
//         // const length = result.data.length;
//         // const index = 0;
//         const cartItem = cart.cartItems.find(cartItem => {
//             return cartItem._id ? cartItem._id.toString() === productId.toString() : null;
//             // index++;
//         })
//         res.json({
//             success: true,
//             quantity: cartItem.productQuantity,
//             cartItemId: cartItem._id.toString(),
//             newPriceInQty: utility.formatMoney(cartItem.productPriceInQty),
//             totalPrice: utility.formatMoney(cart.totalPriceCart),
//             cartQuantity: cart.cartItems.filter(d => d.productQuantity !== 0).length
//         });
//     });

// CartItem.findByPk(cartItemId, { include: Product })
//     .then(cartItem => {
//         cartItem.quantity = cartItem.quantity - 1;
//         newQty = cartItem.quantity;
//         // let newPriceInQty = cartItem.product.productPrice * cartItem.quantity;
//         cartId = cartItem.cartId;
//         if (cartItem.quantity === 0) {
//             return cartItem.destroy();
//             // res.json({ success: true, quantity: cartItem.quantity, cartItemId: cartItem.cartItemId, newPriceInQty: 0, totalPrice: 0 });
//         }
//         else {
//             // newPriceInQty = newPriceInQty - cartItem.product.productPrice;
//             return cartItem.save();
//         }
//     }).then(result => {
//         return CartItem.findAll({ where: { cartId: cartId }, include: Product })
//     }).then(cartItems => {
//         cartItems.forEach(cartItem => {
//             cartQuantity = cartQuantity + 1;
//             const productPrice = cartItem.product.productPrice;
//             const productQuantity = cartItem.quantity;
//             productPriceInQty = parseInt(productQuantity) * productPrice;


//             if (cartItem.cartItemId === parseInt(cartItemId)) {
//                 targetProductQty = productQuantity;
//                 targetProductPriceInQty = productPriceInQty;
//             }

//             totalPrice = totalPrice + productPriceInQty;
//         });
//         res.json({
//             success: true,
//             quantity: targetProductQty,
//             cartItemId: cartItemId,
//             newPriceInQty: formatMoney(targetProductPriceInQty),
//             totalPrice: formatMoney(totalPrice),
//             cartQuantity: cartQuantity
//         });
//     });


exports.addToCart = async (req, res, next) => {
    const productId = req.params.productId;
    const user = req.user;
    let cartQuantity = parseInt(req.cart);

    Product.findById(productId)
        .then(product => {
            // const obj = {
            //     userEmail: user.userEmail, userName: user.userName, cart: user.cart, _id: user._id
            // }
            // const obj2 = {
            //     {user.userEmail}, user.userName,  user.cart, user._id
            // }
            // const userModel = new User(obj);
            return user.addToCart(product)
            // return userModel.addToCart(product);
        })
        .then(result => {
            console.log(`added to cart = ${result}`);
            res.json({ success: true, quantity: result.quantity });
        });
    // // //FINDING EXISTING CART OF USER
    // let cart = await Cart.findOne({ where: { userId: user.userId }, include: CartItem });
    // // let cartQuantity = 0;
    // if (cart === null && !(cart instanceof Cart)) {
    //     let newCart = { userId: user.userId }
    //     cart = await Cart.create(newCart);
    //     // cartQuantity = 1;
    //     // console.log(JSON.stringify(cart));
    // }

    // let newQTY = 1;
    // // let cartPrice;
    // const cartItem = await CartItem.findOne({ where: { productId: productId, cartId: cart.cartId } });
    // if (cartItem === null && !(cartItem instanceof CartItem)) {
    //     CartItem.create({
    //         quantity: newQTY,
    //         cartId: cart.cartId,
    //         productId: productId
    //     }).then(result => {
    //         // console.log(`result CREATE CARTITEM ${result}`);
    //         return Cart.findOne({ where: { userId: user.userId }, include: CartItem });
    //     }).then(cart => {
    //         cartQuantity = cart.cartItems.length;
    //         res.json({ success: true, quantity: cartQuantity });
    //     }).catch(err => console.log(err));
    // }
    // else {
    //     newQTY = cartItem.quantity + 1;
    //     cartItem.quantity = newQTY;
    //     cartItem.save()
    //         .then(result => {
    //             console.log(`result UPDATE CARTITEM = ${result}`);
    //             return Cart.findOne({ where: { userId: user.userId }, include: CartItem });
    //         }).then(cart => {
    //             cartQuantity = cart.cartItems.length
    //             res.json({ success: true, quantity: cartQuantity });
    //         }).catch(err => console.log(err));
    // }
};

exports.getOrder = (req, res, next) => {
    const cartQuantity = req.cart;
    const user = req.user;


    Order.find().then(orders => {
        res.render('shop/orders', {
            pageTitle: 'Shop - Order List',
            path: '/order/',
            // cartQuantity: cartQuantity,
            orders: orders
        });
    });

    // Order.getOrders().then(orders => {
    //     res.render('shop/orders', {
    //         pageTitle: 'Shop - Order List',
    //         path: '/order/',
    //         cartQuantity: cartQuantity,
    //         orders: orders
    //     });
    // })
};

exports.getCheckout = (req, res, next) => {
    const cartQuantity = req.cart;
    const user = req.user;

    if (!req.session.isLoggedIn) {
        return res.redirect('/login/');
    }

    let productPriceInQty = 0;
    let totalPriceCart = 0;
    let cart;

    user.populate('cart.cartItems.product')
        .execPopulate()
        .then(user => {
            return user.cart.cartItems.map(cartItem => {
                // const cartItem = this.cart.cartItems.find(item => {
                //     return item.productId.toString() === product._id.toString();
                // });
                productPriceInQty = cartItem.product.productPrice * cartItem.quantity;
                totalPriceCart += productPriceInQty;
                return {
                    product: { ...cartItem.product.toObject() }, ///...product,
                    // productPro
                    productQuantity: cartItem.quantity,
                    productPriceInQty: utility.formatMoney(productPriceInQty),
                    // totalPriceCart: totalPriceCart
                }
            });
        })
        .then(result => {
            const data = { cartItems: [...result], totalPriceCart: utility.formatMoney(totalPriceCart) };
            return data;
        })
        // .then(result => {
        //     cart = result
        //     return stripe.checkout.sessions.create({
        //         payment_method_types: ['card'],
        //         mode: 'payment',
        //         line_items: cart.cartItems.map(cartItem => {
        //             return {
        //                 name: cartItem.product.productTitle,
        //                 amount: cartItem.product.productPrice * 100,
        //                 quantity: cartItem.productQuantity,
        //                 description: cartItem.product.productDescription,
        //                 currency: 'usd'
        //             }
        //         }),
        //         success_url: req.protocol + '://' + req.get('host') + '/checkout/success/', // ==> http://localhost:3000
        //         cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel/', // ==> http://localhost:3000
        //     });
        // })
        .then(cart => {
            res.render('shop/checkout', {
                pageTitle: 'Shop - Checkout',
                path: '/cart/',
                cart: cart,
                // sessionId: session.id
            });
        });



    // Order.find().then(orders => {
    //     res.render('shop/checkout', {
    //         pageTitle: 'Shop - Order List',
    //         path: '/order/',
    //         // cartQuantity: cartQuantity,
    //         orders: orders
    //     });
    // });
};
// Post Checkout Ajax - Asynchronous Javascript Request
exports.postCheckout = (req, res, next) => {
    const user = req.user;
    const address = req.query.address;
    const phone = req.query.phone;
    const name = req.query.name;
    let orderPrice = 0;
    let productPriceInQty = 0
    let newOrder;
    let sessionid;
    user.populate('cart.cartItems.product')
        .execPopulate()
        .then(user => {
            return user.cart.cartItems.map(cartItem => {
                productPriceInQty = cartItem.product.productPrice * cartItem.quantity;
                orderPrice = orderPrice + productPriceInQty;
                return {
                    product: { ...cartItem.product.toObject() },
                    totalPrice: productPriceInQty,
                    quantity: cartItem.quantity
                }
            })
        })
        .then(cartItems => {
            const order = new Order({
                orderName: name,
                orderAddress: address,
                orderPhone: phone,
                orderPrice: orderPrice,
                orderTrackingNumber: utility.createGuid().substr(0, 13),
                user: user._id,
                orderItems: cartItems.toBSON(),
                success: false
            });
            return order.save();
        })
        .then(order => {
            newOrder = order;
            return stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                line_items: order.orderItems.map(orderItem => {
                    return {
                        name: orderItem.product.productTitle,
                        amount: orderItem.product.productPrice * 100,
                        quantity: orderItem.quantity,
                        description: orderItem.product.productDescription,
                        currency: 'usd'
                    }
                }),
                success_url: req.protocol + '://' + req.get('host') + '/checkout/success/?orderId=' + order._id, // ==> http://localhost:3000
                cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel/', // ==> http://localhost:3000
            });
        })
        .then(session => {
            // res.redirect('/order/');
            res.json({
                success: true,
                // orderId: newOrder._id,
                sessionId: session.id
            })
        });
};


exports.getCheckoutSuccess = (req, res, next) => {
    const user = req.user;
    // const orderName = req.body.orderName;
    const orderId = req.query.orderId;
    // const orderAddress = req.body.orderAddress;
    // const orderName = req.body.orderName;
    // const orderPhone = req.body.orderPhone;

    // const userObj = new User(user.email, user.name, user.cart, user._id);
    let orderPrice = 0;
    let productPriceInQty = 0
    // user.populate('cart.cartItems.product')
    //     .execPopulate()
    Order.findOne({ _id: orderId })
        .then(order => {
            // if (order) {
            order.success = true;
            return order.save();
            // }
        })
        .then(order => {
            user.cart.cartItems = [];
            user.save();
            res.render('shop/checkout-success', {
                pageTitle: 'Shop - Checkout Success!',
                path: '/cart/',
                order: order,
                // sessionId: session.id
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

    // .then(user => {
    //     return user.cart.cartItems.map(cartItem => {
    //         productPriceInQty = cartItem.product.productPrice * cartItem.quantity;
    //         orderPrice = orderPrice + productPriceInQty;
    //         return {
    //             product: { ...cartItem.product.toObject() },
    //             totalPrice: productPriceInQty,
    //             quantity: cartItem.quantity
    //         }
    //     })
    // })
    // .then(result => {
    //     const order = new Order({
    //         orderName: orderName,
    //         orderAddress: orderAddress,
    //         orderPhone: orderPhone,
    //         orderPrice: orderPrice,
    //         orderTrackingNumber: utility.createGuid().substr(0, 13),
    //         user: user._id,
    //         orderItems: result.toBSON()
    //     });
    //     return order.save();
    // })
    // .then(result => {
    //     console.log(`order has been saved and added! = ${result}`);

    //     user.cart.cartItems = [];
    //     return user.save();
    //     // const model = { cart: { cartItems: [] } };
    //     // User.update(model, user._id).then(result => {
    //     //     res.redirect('/order/');
    //     // });
    // })
    // .then(reuslt => {
    //     res.redirect('/order/');
    // });



    //     user.name,
    //         orderAddress,
    //         orderPhone,
    //         cart.totalPriceCart,
    //         utility.createGuid().substr(0, 13),
    //         user._id.toString(),
    //         cart.cartItems);
    //     order.save()
    //         .then((result) => {
    //             console.log(`order has been saved and added! = ${result}`);
    //             const model = { cart: { cartItems: [] } };
    //             User.update(model, user._id).then(result => {
    //                 res.redirect('/order/');
    //             });
    //         })
    //         .catch(err => { console.log(err) });
    // });
};


exports.getCheckoutCancel = (req, res, next) => {
};

exports.getInvoice = (req, res, next) => {
    const cartQuantity = req.cart;
    const user = req.user;
    const orderId = req.params.orderId;
    const invoiceName = 'invoice' + '-' + orderId + '.pdf';
    const invoicePath = path.join('data', 'invoices', invoiceName);

    Order.findById(orderId).then(order => {
        if (!order) {
            return next(new Error('this invoice not found!'));
        }
        if (order.user._id.toString() !== user._id.toString()) {
            return next(new Error('User unauthorized!'));
        }

        // fs.readFile(invoicePath, (err, data) => {
        //     if (err) {
        //         return next(err);
        //     }
        //     res.setHeader('Content-Type', 'application/pdf');
        //     res.setHeader('Content-Disposition', 'inline; filename ="' + invoiceName + '"');
        //     // res.setHeader('Content-Disposition', 'attachment; filename ="' + invoiceName + '"')
        //     res.send(data);
        // });


        const doc = new PDFDocument();
        const file = fs.createWriteStream(invoicePath);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename ="' + invoiceName + '"');
        doc.pipe(file);
        doc.pipe(res);

        // Header
        doc.fontSize(25).text(`Invoice #${order.orderTrackingNumber}`);

        // doc.dash(100, { space: 10 });


        // doc
        // .fontSize(10)
        // .text(
        //   "Payment is due within 15 days. Thank you for your business.",
        //   50,
        //   780,
        //   { align: "center", width: 500 }
        // );

        doc.lineCap('round')
            .moveTo(50, 95)
            .lineTo(600, 95)
            .stroke("#afa79d").fillOpacity(0.8);

        doc.fontSize(12).text(`User Name : ${order.orderName}`).moveDown(0.5);
        doc.fontSize(12).text(`Address : ${order.orderAddress}`).moveDown(0.5);
        doc.fontSize(12).text(`Phone Number : ${order.orderPhone}`).moveDown(0.9);
        doc.fontSize(15).fillColor('#33065d').text(`Order Price : $${order.orderPrice}`).moveDown(1.5);

        let yMoveTo = 0;
        let y = 200;
        order.orderItems.forEach(orderItem => {

            doc.lineCap('round')
                .moveTo(50, y)
                .lineTo(600, y)
                .stroke("#afa79d").fillOpacity(0.8);

            // .fillAndStroke("red", "#900");
            doc.fontSize(14).fillColor('black').text(`Product Title : ${orderItem.product.productTitle}`).moveDown(0.5);
            doc.fontSize(12).fillColor('black').text(`Product Description : ${orderItem.product.productDescription}`).moveDown(0.5);
            doc.fontSize(12).fillColor('black').text(`Product Price : $${orderItem.product.productPrice}`).moveDown(0.5);
            // doc.image(orderItem.product.productImageUrl,0, 15, {width: 300})
            // .text('Proportional to width', 0, 0);
            doc.fontSize(12).fillColor('black').text(`QTY : ${orderItem.quantity}`).moveDown(0.5);
            // doc.lineCap('round')
            //     .moveTo(60, y + 90)
            //     .lineTo(200, y + 90)
            //     .stroke("red", "#900").fillOpacity(0.8)
            //     .fillAndStroke("red", "#900");
            doc.fontSize(12).fillColor('#afa79d').text('===================');
            doc.fontSize(12).fillColor('#33065d').text(`Total Price : $${orderItem.totalPrice}`).moveDown(2.2);
            // doc.lineCap('round')
            // .moveTo(50, 800)
            // .lineTo(600, 800)
            // .stroke("red", "#900").fillOpacity(0.8)
            // .fillAndStroke("red", "#900");
            y += 145;
        })

        // Draw a triangle
        // doc.save()
        //     .moveTo(100, 150)
        //     .lineTo(100, 250)
        //     .lineTo(200, 250)
        //     .fill("#FF3300");

        doc.end();

        // const file = fs.createReadStream(invoicePath);
        // res.setHeader('Content-Type', 'application/pdf');
        // res.setHeader('Content-Disposition', 'inline; filename ="' + invoiceName + '"');
        // file.pipe(res);

    }).catch(err => next(err))



};
