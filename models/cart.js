const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const Cart = sequelize.define('cart', {
    cartId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true
    },
    // cartPrice:{
    //     type: DataTypes.DOUBLE,
    //     allowNull: false
    // }

});

module.exports = Cart;