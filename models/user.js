// const getDb = require('../util/database').getDb;
// const mongoDb = require('mongodb');

const utility = require('../util/utility');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: {
        type: String,
        required: false
    },
    userEmail: {
        type: String,
        required: true
    },
    userPassword: {
        type: String,
        required: true
    },
    cart: {
        cartItems: [
            {
                product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, required: true }
            }
        ]
    }
});

userSchema.methods.addToCart = function (product) {
    let cartProductIndex = -1;
    let updatedCartItems = [];
    if (this.cart.cartItems) {
        cartProductIndex = this.cart.cartItems.findIndex(cartProd => {
            return cartProd.product.toString() === product._id.toString();
        });
        updatedCartItems = [...this.cart.cartItems];
    }
    let newQTY = 1;
    if (cartProductIndex >= 0) {
        newQTY = this.cart.cartItems[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQTY;
    } else {
        updatedCartItems.push({
            product: product._id,
            quantity: newQTY
        });
    }
    // const updatedCart = { cartItems: [{ ...product, quantity: 1 }] }
    const updatedCart = { cartItems: updatedCartItems };
    this.cart = updatedCart;
    this.save();
    return { quantity: updatedCart.cartItems.length };
    // return collection.updateOne({ _id: this._id }, { $set: { cart: updatedCart } })
    //     .then(result => {
    //         console.log(`updated cart = ${result}`);
    //         return { quantity: updatedCart.cartItems.length };
    //     });
}

userSchema.methods.getCart = function () {
    let productPriceInQty = 0;
    let totalPriceCart = 0;
    const test = this;
    const productIds = this.cart.cartItems.map(item => {
        return item.productId;
    });
    return collection.find({ _id: { $in: productIds } })
        .toArray()
        .then(products => {
            return products.map(product => {
                const cartItem = this.cart.cartItems.find(item => {
                    return item.productId.toString() === product._id.toString();
                });
                productPriceInQty = product.productPrice * cartItem.quantity;
                totalPriceCart = totalPriceCart + productPriceInQty;
                return {
                    ...product,
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
        });
}

module.exports = mongoose.model('User', userSchema);



// class User {
//     constructor(email, name, cart, userId) {
//         this.email = email;
//         this.name = name;
//         this.cart = cart;
//         this._id = userId ? new mongoDb.ObjectID(userId) : null;
//     }

//     save() {
//         const db = getDb();
//         const collection = db.collection("users");
//         let dbResult = collection.insertOne(this);
//         return dbResult
//             .then(result => {
//                 console.log(`result insertOne = ${result}`);
//             })
//             .catch(err => console.log(err));
//     }

//     static update(model, userId) {
//         const db = getDb();
//         const collection = db.collection("users");
//         return collection.updateOne({ _id: new mongoDb.ObjectID(userId) }, { $set: model }).then(result => {
//             return result;
//         });
//     }

//     update() {
//         const db = getDb();
//         const collection = db.collection("users");
//         return collection.updateOne({ _id: this._id }, { $set: this }).then(result => {
//             return result;
//         });
//     }

//     static findById(userId) {
//         const db = getDb();
//         const collection = db.collection("users");
//         return collection.findOne({ _id: new mongoDb.ObjectID(userId) })
//     }

//     addToCart(product) {
//         const db = getDb();
//         const collection = db.collection("users");

//         let cartProductIndex = -1;
//         let updatedCartItems = [];
//         if (this.cart.cartItems) {
//             cartProductIndex = this.cart.cartItems.findIndex(cartProd => {
//                 return cartProd.productId.toString() === product._id.toString();
//             });
//             updatedCartItems = [...this.cart.cartItems];
//         }
//         let newQTY = 1;
//         if (cartProductIndex >= 0) {
//             newQTY = this.cart.cartItems[cartProductIndex].quantity + 1;
//             updatedCartItems[cartProductIndex].quantity = newQTY;
//         } else {
//             updatedCartItems.push({
//                 productId: new mongoDb.ObjectID(product._id),
//                 quantity: newQTY
//             });
//         }
//         // const updatedCart = { cartItems: [{ ...product, quantity: 1 }] }
//         const updatedCart = { cartItems: updatedCartItems };
//         return collection.updateOne({ _id: this._id }, { $set: { cart: updatedCart } })
//             .then(result => {
//                 console.log(`updated cart = ${result}`);
//                 return { quantity: updatedCart.cartItems.length };
//             });
//     }

//     getCart() {
//         // return this.cart;
//         const db = getDb();
//         const collection = db.collection("products");
//         let productPriceInQty = 0;
//         let totalPriceCart = 0;
//         const productIds = this.cart.cartItems.map(item => {
//             return item.productId;
//         });
//         return collection.find({ _id: { $in: productIds } })
//             .toArray()
//             .then(products => {
//                 return products.map(product => {
//                     const cartItem = this.cart.cartItems.find(item => {
//                         return item.productId.toString() === product._id.toString();
//                     });
//                     productPriceInQty = product.productPrice * cartItem.quantity;
//                     totalPriceCart = totalPriceCart + productPriceInQty;
//                     return {
//                         ...product,
//                         productQuantity: cartItem.quantity,
//                         productPriceInQty: utility.formatMoney(productPriceInQty),
//                         // totalPriceCart: totalPriceCart
//                     }
//                 });
//             })
//             .then(result => {
//                 const data = { cartItems: [...result], totalPriceCart: utility.formatMoney(totalPriceCart) };
//                 // const data = result.push({ totalPriceCart: totalPriceCart });

//                 return data;
//             });
//     }

//     deleteItemFromCart(productId) {
//         const db = getDb();
//         const collection = db.collection("users");

//         const updatedCartItems = this.cart.cartItems.filter(item => {
//             return item.productId.toString() !== productId.toString()
//         });

//         return collection.updateOne({ _id: this._id }, { $set: { cart: { cartItems: updatedCartItems } } })
//             .then(result => {
//                 console.log(`updated cart QTY (decrease QTY) = ${result}`);
//                 return { result };
//             });
//     }

//     decreaseQuantityFromCart(productId) {
//         const db = getDb();
//         const collection = db.collection("users");

//         const updatedCartItems = this.cart.cartItems.filter(item => {
//             if (item.productId.toString() === productId.toString()) {
//                 item.quantity = item.quantity - 1;
//             }
//             if (item.quantity > 0) {
//                 return item;
//             }
//             // updatedCartItems.quantity = updatedCartItems.quantity - 1;
//             // return item.productId.toString() === productId.toString()
//         });
//         // updatedCartItems.quantity = updatedCartItems.quantity - 1;

//         return collection.updateOne({ _id: this._id }, { $set: { cart: { cartItems: updatedCartItems } } })
//             .then(result => {
//                 console.log(`updated cart QTY (decrease QTY) = ${result}`);
//                 return { result };
//             });
//     }
// }

// module.exports = User;