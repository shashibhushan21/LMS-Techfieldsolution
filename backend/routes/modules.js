const express = require('express');
const router = express.Router();
const {
  getModules,
  getModule,
  createModule,
  updateModule,
  deleteModule,
  publishModule,
  getInternshipModules
} = require('../controllers/moduleController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getModules);
router.get('/internship/:internshipId', protect, getInternshipModules);
router.get('/:id', protect, getModule);
router.post('/', protect, authorize('admin', 'mentor'), createModule);
router.put('/:id', protect, authorize('admin', 'mentor'), updateModule);
router.delete('/:id', protect, authorize('admin', 'mentor'), deleteModule);
router.patch('/:id/publish', protect, authorize('admin', 'mentor'), publishModule);

module.exports = router;
