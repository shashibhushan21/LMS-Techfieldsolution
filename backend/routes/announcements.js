const express = require('express');
const router = express.Router();
const {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  markAnnouncementAsRead,
  pinAnnouncement
} = require('../controllers/announcementController');
const { protect, authorize } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');

router.get('/', protect, getAnnouncements);
router.get('/:id', protect, getAnnouncement);
router.post('/', protect, authorize('admin', 'mentor'), upload.array('attachments', 3), handleMulterError, createAnnouncement);
router.put('/:id', protect, authorize('admin', 'mentor'), updateAnnouncement);
router.delete('/:id', protect, authorize('admin', 'mentor'), deleteAnnouncement);
router.put('/:id/read', protect, markAnnouncementAsRead);
router.patch('/:id/pin', protect, authorize('admin', 'mentor'), pinAnnouncement);

module.exports = router;
