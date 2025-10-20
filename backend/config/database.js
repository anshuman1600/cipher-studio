// ========================================
// DATABASE CONNECTION
// Connect to MongoDB database
// ========================================

const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * @returns {Promise} - Connection promise
 */
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ Connected to MongoDB successfully!');
    console.log(`📍 Database Host: ${connection.connection.host}`);
    
    return connection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('💡 Make sure to update MONGODB_URI in .env file');
    process.exit(1); // Exit if database connection fails
  }
};

module.exports = connectDB;
