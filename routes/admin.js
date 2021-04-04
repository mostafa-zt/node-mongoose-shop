const express = require('express');
const multer = require('multer')

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/isAuth');
const AdminValidator = require('../validation/adminValidator');
// const cloudinaryUtility = require('../util/cloudinaryUtility');

const router = express.Router();

const upload = multer()

router.get('/add-product/', isAuth, adminController.getAddProduct);
router.post('/add-product/', isAuth, AdminValidator.checkAddEditProduct(), adminController.postAddProduct);
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
router.post('/edit-product/', isAuth, AdminValidator.checkAddEditProduct(), adminController.postEditProduct);
router.get('/removeProduct/:productId', isAuth, adminController.postRemoveProduct);
router.get('/products/', isAuth, adminController.getProductList);

module.exports = router;