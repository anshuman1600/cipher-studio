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
    // Support both MONGO_URI and MONGODB_URI for flexibility
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MongoDB URI not found in environment variables');
    }
    
    const connection = await mongoose.connect(mongoUri);
    
    console.log('✅ Connected to MongoDB successfully!');
    console.log(`📍 Database Host: ${connection.connection.host}`);
    
    return connection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('💡 Make sure to set MONGO_URI or MONGODB_URI in environment variables');
    process.exit(1); // Exit if database connection fails
  }
};

module.exports = connectDB;
