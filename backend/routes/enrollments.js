const express = require('express');
const router = express.Router();
const {
  enroll,
  getEnrollments,
  getUserEnrollments,
  getMyEnrollments,
  updateEnrollmentStatus,
  getEnrollmentProgress,
  dropEnrollment
} = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, enroll);
router.get('/', protect, authorize('admin', 'mentor'), getEnrollments);
router.get('/my-enrollments', protect, authorize('intern'), getMyEnrollments);
router.get('/user/:userId', protect, getUserEnrollments);
router.get('/:id/progress', protect, getEnrollmentProgress);
router.put('/:id/status', protect, authorize('admin', 'mentor'), updateEnrollmentStatus);
router.delete('/:id', protect, dropEnrollment);

module.exports = router;
