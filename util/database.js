// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'shop',
//     password: 'admin81265'
// });

// module.exports = pool.promise();


// const { Sequelize } = require('sequelize');
// const squelize = new Sequelize('shop_project', 'root', 'admin81265', { dialect: 'mysql', host: 'localhost' });

// Object.keys(squelize).forEach(model => {
//     if ("associate" in squelize[model]) {
//         squelize[model].associate(squelize)
//     }
// })

// module.exports = squelize; 
let _db;

const mongoDb = require('mongoDb');
const mongoDbClient = mongoDb.MongoClient;

const mongoConnect = (callback) => {
    mongoDbClient.connect('mongodb+srv://mostafa:LUjiZggnXA6agN2f@cluster0.wvo17.mongodb.net/mostafa?retryWrites=true&w=majority')
        .then(client => {
            console.log('Connected!');
            _db = client.db();
            callback();
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
};

const getDb = () => {
    if (_db) {
        return _db
    }
    throw 'No databse found!';
}

// module.exports = mongoConnect;

// exports.mongoConnect = mongoConnect;
// exports.getDb = getDb;

