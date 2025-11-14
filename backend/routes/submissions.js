const express = require('express');
const router = express.Router();
const {
  submitAssignment,
  getSubmissions,
  getSubmission,
  gradeSubmission,
  getMySubmissions,
  updateSubmission,
  deleteSubmission
} = require('../controllers/submissionController');
const { protect, authorize } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');

router.post('/', protect, authorize('intern'), upload.array('files', 5), handleMulterError, submitAssignment);
router.get('/', protect, getSubmissions);
router.get('/my-submissions', protect, authorize('intern'), getMySubmissions);
router.get('/:id', protect, getSubmission);
router.put('/:id', protect, authorize('intern'), upload.array('files', 5), handleMulterError, updateSubmission);
router.put('/:id/grade', protect, authorize('admin', 'mentor'), gradeSubmission);
router.delete('/:id', protect, deleteSubmission);

module.exports = router;
