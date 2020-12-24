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
    isAdmin: {
        type: Boolean,
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
    const updatedCart = { cartItems: updatedCartItems };
    this.cart = updatedCart;
    this.save();
    return { quantity: updatedCart.cartItems.length };
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
                }
            });
        })
        .then(result => {
            const data = { cartItems: [...result], totalPriceCart: utility.formatMoney(totalPriceCart) };
            return data;
        });
}

module.exports = mongoose.model('User', userSchema);