const express = require('express');
const router = express.Router();
const {
  generateCertificate,
  getCertificate,
  verifyCertificate,
  getUserCertificates,
  downloadCertificate
} = require('../controllers/certificateController');
const { protect, authorize } = require('../middleware/auth');

router.post('/generate', protect, authorize('admin', 'mentor'), generateCertificate);
router.get('/user/:userId', protect, getUserCertificates);
router.get('/:id', protect, getCertificate);
router.get('/:id/download', protect, downloadCertificate);
router.get('/verify/:certificateId', verifyCertificate);

module.exports = router;
