// const getDb = require('../util/database').getDb;
// const mongoDb = require('mongodb');
// const { mongoConnect } = require('../util/database');

const mongoose = require('mongoose');
// const { schema } = require('./user');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orderName: {
        type: String,
        required: true
    },
    orderAddress: {
        type: String,
        required: true
    },
    orderPhone: {
        type: Number,
        required: false
    },
    orderPrice: {
        type: Number,
        required: true
    },
    orderTrackingNumber: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    orderItems: [
        {
            product: { type: Object, required: true },
            quantity: { type: Number, required: true },
            totalPrice: { type: Number, required: true },
        }
    ],
    success: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('Order', orderSchema);



// class orderItem {
//     constructor(productTitle, productPrice, productDescription, productImageUrl, productId, quantity, totalPrice, orderItemId) {
//         this.productTitle = productTitle;
//         this.productPrice = productPrice;
//         this.productDescription = productDescription;
//         this.productImageUrl = productImageUrl;
//         this.productId = productId;
//         this.quantity = quantity;
//         this.totalPrice = totalPrice;
//         this._id = orderItemId ? new mongoDb.ObjectID(orderItemId) : null;
//     }
// }

// class Order {
//     constructor(orderName, orderAddress, orderPhone, orderPrice, orderTrackingNumber, userId, orderItems, orderId) {
//         this.orderName = orderName;
//         this.orderAddress = orderAddress;
//         this.orderPhone = orderPhone;
//         //Total price of order items 
//         this.orderPrice = orderPrice;
//         this.orderTrackingNumber = orderTrackingNumber;
//         this.userId = userId;
//         this.orderItems = orderItems
//         this._id = orderId ? new mongoDb.ObjectID(orderId) : null;
//     }


//     save() {
//         const db = getDb();
//         const collection = db.collection("orders");
//         let dbResult = collection.insertOne(this);
//         return dbResult
//             .then(result => {
//                 console.log(`result insertOne = ${result}`);
//             })
//             .catch(err => console.log(err));
//     }

//     static findById(orderId) {
//         const db = getDb();
//         const collection = db.collection("orders");
//         return collection.findOne({ _id: new mongoDb.ObjectID(orderId) })
//     }

//     static getOrders(userId) {
//         const db = getDb();
//         const collection = db.collection("orders");
//         return collection.find().toArray().then(orders => {
//             console.log(`find() - all orders ${orders}`);
//             return orders;
//         });
//     }

// }

// exports.order = Order;
// exports.orderItems = orderItem