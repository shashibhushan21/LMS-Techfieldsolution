const express = require('express');
const router = express.Router();
const {
  generateCertificate,
  generateCertificateManual,
  getCertificates,
  getCertificate,
  verifyCertificate,
  getUserCertificates,
  downloadCertificate,
  revokeCertificate
} = require('../controllers/certificateController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getCertificates);
router.post('/generate', protect, authorize('admin', 'mentor'), generateCertificate);
router.post('/generate-manual', protect, authorize('admin'), generateCertificateManual);
router.get('/user/:userId', protect, getUserCertificates);
router.get('/verify/:certificateId', verifyCertificate);
router.get('/:id', protect, getCertificate);
router.get('/:id/download', protect, downloadCertificate);
router.put('/:id/revoke', protect, authorize('admin'), revokeCertificate);

module.exports = router;
