const express = require('express');
const router = express.Router();
const {
  getInternships,
  getInternship,
  createInternship,
  updateInternship,
  deleteInternship,
  getMyInternships,
  searchInternships
} = require('../controllers/internshipController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

// Public routes
router.get('/', optionalAuth, getInternships);
router.get('/search', searchInternships);
router.get('/:id', optionalAuth, getInternship);

// Protected routes
router.get('/me/my-internships', protect, getMyInternships);
router.post('/', protect, authorize('admin', 'mentor'), createInternship);
router.put('/:id', protect, authorize('admin', 'mentor'), updateInternship);
router.delete('/:id', protect, authorize('admin'), deleteInternship);

module.exports = router;
