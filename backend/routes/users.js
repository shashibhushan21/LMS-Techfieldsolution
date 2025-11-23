const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadResume,
  getInternProfile,
  getContacts
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');

// Admin routes
router.route('/')
  .get(protect, authorize('admin'), getUsers)
  .post(protect, authorize('admin'), createUser);

// Contacts for messaging
router.get('/contacts', protect, getContacts);

router.route('/:id')
  .get(protect, getUser)
  .put(protect, updateUser)
  .delete(protect, authorize('admin'), deleteUser);

// Resume upload
router.post('/:id/resume', protect, upload.single('resume'), handleMulterError, uploadResume);

// Intern profile
router.get('/:id/profile', getInternProfile);



module.exports = router;
