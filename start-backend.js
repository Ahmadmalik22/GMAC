// Startup script to set environment variables and run the backend
process.env.NODE_ENV = 'development';
process.env.PORT = '5000';
process.env.MONGODB_URI = 'mongodb+srv://ahmadmalik:ahmad22.66@cluster0.mgstq.mongodb.net/GMAC?appName=Cluster0';
process.env.JWT_SECRET = 'ahmad22';
process.env.JWT_EXPIRE = '7d';
process.env.BCRYPT_ROUNDS = '12';

console.log('🚀 Starting GMAC Attendance Backend...');
console.log('📡 MongoDB URI configured');
console.log('🔐 JWT Secret configured');

// Now run the actual server
require('./backend/server.js');