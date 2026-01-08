const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log(`📍 Connection URI: ${process.env.MONGODB_URI ? 'Found in .env file' : '❌ NOT FOUND - Please check your .env file'}`);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`🏠 Host: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
    console.log(`🔌 Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Not Connected'}`);
    
    // Log all database operations (useful for debugging)
    mongoose.set('debug', (collectionName, method, query, doc) => {
      console.log(`🔍 MongoDB Query: ${collectionName}.${method}`, JSON.stringify(query));
    });
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Error:`);
    console.error(`Error Message: ${error.message}`);
    console.error(`Full Error:`, error);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  Mongoose disconnected from MongoDB');
});

module.exports = connectDB;