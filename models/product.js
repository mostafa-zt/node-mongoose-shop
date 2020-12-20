// const getDb = require('../util/database').getDb;
// const mongoDb = require('mongodb');
// const { mongoConnect } = require('../util/database');

const mongoose = require('mongoose');
const { schema } = require('./user');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    productTitle: {
        type: String,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    productAuthor: {
        type: String,
        required: false
    },
    productDescription: {
        type: String,
        required: true
    },
    productImageUrl: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Product', productSchema);

// class Product {
//     constructor(productTitle, productPrice, productAuthor, productDescription, productImageUrl, productId, userId) {
//         this.productTitle = productTitle;
//         this.productPrice = productPrice;
//         this.productAuthor = productAuthor;
//         this.productDescription = productDescription;
//         this.productImageUrl = productImageUrl;
//         this._id = productId ? new mongoDb.ObjectID(productId) : null;
//         this.userId = userId;
//     }

//     save() {
//         const db = getDb();
//         const collection = db.collection("products");
//         let dbResult;
//         if (this._id) {
//             //Update the product
//             dbResult = collection.updateOne({ _id: this._id }, { $set: this })
//         }
//         else {
//             //Add a new one
//             dbResult = collection.insertOne(this);
//         }
//         return dbResult
//             .then(result => {
//                 console.log(`result insertOne = ${result}`);
//             })
//             .catch(err => console.log(err));
//     }

//     static fetchAll() {
//         const db = getDb();
//         const collection = db.collection("products");
//         return collection.find().toArray().then(products => {
//             console.log(`fetch All = ${products}`);
//             return products;
//         });
//     }

//     static findById(productId) {
//         const db = getDb();
//         const collection = db.collection("products");
//         return collection.find({ _id: new mongoDb.ObjectID(productId) })
//             .next()
//             .then(product => {
//                 console.log(`fetch One = ${product}`);
//                 return product;
//             });
//     }

//     static deleteById(productId) {
//         const db = getDb();
//         const collection = db.collection("products");
//         collection.deleteOne({ _id: new mongoDb.ObjectID(productId) })
//             .then(() => {
//                 console.log('removed!');
//             })
//             .catch(err => {
//                 console.log(err)
//             })
//     }
// }


// module.exports = Product;



// const { Sequelize, DataTypes } = require('sequelize');
// const { col } = require('sequelize/types/lib/operators');
// const sequelize = require('../util/database');

// const Product = sequelize.define('product', {
//     productId: {
//         type: DataTypes.INTEGER,
//         // defaultValue: 'green',
//         allowNull: false,
//         autoIncrement: true,
//         unique: true,
//         primaryKey: true
//     },
//     productTitle: {
//         type: DataTypes.STRING
//     },
//     productPrice: {
//         type: DataTypes.DOUBLE,
//         allowNull: false,
//     },
//     productAuthor: {
//         type: DataTypes.STRING,
//         allowNull: true,
//     },
//     productDescription: {
//         type: DataTypes.STRING,
//         allowNull: true,
//     },
//     productImageUrl: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     }
// });

// module.exports = Product;