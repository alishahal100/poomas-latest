const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authmiddleware');
const multer = require('multer');
const ProductController = require('../controller/ProductController');

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Save only the original filename
  }
});

const upload = multer({ storage: storage });

router.get('/get-products', ProductController.getProducts);

// Add a new product
router.post('/add-products', protect, isAdmin, upload.fields([{ name: 'images', maxCount: 5 }, { name: 'videos', maxCount: 5 }]), ProductController.addProduct);

router.put('/products/:id', protect, isAdmin, ProductController.updateProduct);
router.delete('/products/remove/:productId', protect, isAdmin, ProductController.deleteProduct);
router.get('/products/search', ProductController.searchProducts);
router.get('/products/filters', ProductController.getFilterOptions);

module.exports = router;
