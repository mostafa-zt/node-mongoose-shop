const express = require('express');
// const path = require('path');
// const routeDir = require('../util/path');
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/isAuth');

const router = express.Router();



router.get('/add-product/', isAuth, adminController.getAddProduct);
router.post('/add-product/', isAuth, adminController.postAddProduct);
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
router.post('/edit-product/', isAuth, adminController.postEditProduct);
router.get('/removeProduct/:productId', isAuth, adminController.postRemoveProduct);
router.get('/products/', isAuth, adminController.getProductList);

// module.exports = {
//     routes: router,
//     products: products
// }

module.exports = router;