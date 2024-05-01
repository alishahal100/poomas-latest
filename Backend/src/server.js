const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userDetails = require('./routes/adminRouter');
const ProductRoutes = require('./routes/productRoutes');
const twilio = require('twilio');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());

// Define frontend URL
app.use(cors())

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, 'frontend' ,'index.html')));




// Define routes


const categories = {
  vehicles: ['ManufacturerName', 'seatingCapacity', 'Kilometers', 'fuelType', 'transmission', 'Year', 'Color', 'exteriorColor', 'variant', 'trim', 'bodyType'],
  apartments: ['numberOfRooms'] // Add more categories as needed
};

// Get features for a specific category
router.get('/:category/features', (req, res) => {
  const { category } = req.params;
  const categoryFeatures = categories[category] || [];
  res.json(categoryFeatures);
});




app.use('/api/auth', authRoutes);
app.use('/api/admin', userDetails);
app.use('/api/', ProductRoutes);
app.use('/uploads', express.static( 'uploads'));
// Initialize otpMap to store OTPs
const otpMap = new Map();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected');
    // Start the server after successful MongoDB connection
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));
