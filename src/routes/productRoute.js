const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')

router.get('/products', productController.getAllProducts)
router.get('/products/:id', productController.getProductById)
router.get('/category/:categoryid', productController.getProductByCategory)
router.post('/products', productController.createProduct)
router.put('/products/:id', productController.uptadeProduct)
router.delete('/products/:id', productController.deleteProduct)

module.exports=router