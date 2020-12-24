const mongoose = require('mongoose');
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