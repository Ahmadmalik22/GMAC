const express = require('express');
const {
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  deactivateAccount
} = require('../controllers/authController.js');
const { protect } = require('../middleware/auth.js');

const router = express.Router();

// Public routes
router.post('/login', login);

// Protected routes
router.use(protect); // All routes below require authentication

router.post('/logout', logout);
router.get('/me', getMe);
router.put('/updatedetails', updateDetails);
router.put('/updatepassword', updatePassword);
router.delete('/deactivate', deactivateAccount);

module.exports = router;