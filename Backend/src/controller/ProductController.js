const Product = require('../models/Product');



exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// Add a new product
exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      Price,
      location,
      category,
      features
    } = req.body;

    const createdBy = req.user.userId;

    const product = new Product({
      name,
      description,
      Price,
      location,
      category,
      features,
      createdBy
    });

    // Check if images and videos are present in the request
    if (req.files && req.files.images) {
      // Map the uploaded images to their original file names
      const imageNames = req.files.images.map(image => image.originalname);
      // Store the file names in the images field of the product
      product.images = imageNames;
    }

    // Check if videos are present in the request
    if (req.files && req.files.videos) {
      // Map the uploaded videos to their original file names and store them in the videos field of the product
      product.videos = req.files.videos.map(video => video.originalname);
    }

    await product.save();
    res.status(201).json({
      message: 'Product added successfully'
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({
      message: 'Failed to add product'
    });
  }
};



exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    // Find the product by id and update its fields
    const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Failed to update product' });
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    // Find the product by ID and delete it
    await Product.findByIdAndDelete(productId);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};



// Controller function for searching products
 exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    
    // Search products based on name or description
    const searchResults = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } }, // Case-insensitive search by name
        { description: { $regex: query, $options: 'i' } }, // Case-insensitive search by description
      ],
    });
    console.log("searchResults: ",searchResults);

    res.status(200).json(searchResults);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getFilterOptions = async (req, res) => {
  try {
    const filterOptions = {};
    
    // Fetch unique values for each product feature
    const uniqueCategories = await Product.distinct('category');
    filterOptions.category = uniqueCategories;

    const uniqueLocations = await Product.distinct('location');
    filterOptions.location = uniqueLocations;

    const uniqueFuelTypes = await Product.distinct('features.fuelType');
    filterOptions.fuelType = uniqueFuelTypes;

    // Add more features as needed

    res.status(200).json({ filterOptions });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


