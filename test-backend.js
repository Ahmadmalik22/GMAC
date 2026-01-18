// Temporary hardcoded environment variables for testing
process.env.NODE_ENV = 'development';
process.env.PORT = '5000';
process.env.MONGODB_URI = 'mongodb+srv://ahmadmalik:ahmad22.66@cluster0.mgstq.mongodb.net/GMAC?appName=Cluster0';
process.env.JWT_SECRET = 'ahmad22';
process.env.JWT_EXPIRE = '7d';
process.env.BCRYPT_ROUNDS = '12';

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log('✅ Database connection successful!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

connectDB();