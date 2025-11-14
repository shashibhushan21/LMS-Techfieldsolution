const express = require('express');
const router = express.Router();
const {
  getAssignments,
  getAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getModuleAssignments,
  getMyAssignments
} = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getAssignments);
router.get('/my-assignments', protect, authorize('intern'), getMyAssignments);
router.get('/module/:moduleId', protect, getModuleAssignments);
router.get('/:id', protect, getAssignment);
router.post('/', protect, authorize('admin', 'mentor'), createAssignment);
router.put('/:id', protect, authorize('admin', 'mentor'), updateAssignment);
router.delete('/:id', protect, authorize('admin', 'mentor'), deleteAssignment);

module.exports = router;
