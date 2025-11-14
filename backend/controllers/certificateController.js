const Certificate = require('../models/Certificate');
const Enrollment = require('../models/Enrollment');
const { generateCertificatePDF, verifyCertificate } = require('../services/certificateService');

/**
 * @desc    Get all certificates
 * @route   GET /api/certificates
 * @access  Private
 */
exports.getCertificates = async (req, res, next) => {
  try {
    const { user, internship } = req.query;

    const query = {};
    if (user) query.user = user;
    if (internship) query.internship = internship;

    // Interns can only see their own certificates
    if (req.user.role === 'intern') {
      query.user = req.user.id;
    }

    const certificates = await Certificate.find(query)
      .populate('user', 'firstName lastName email')
      .populate('internship', 'title domain company')
      .sort({ issuedDate: -1 });

    res.status(200).json({
      success: true,
      count: certificates.length,
      data: certificates
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single certificate
 * @route   GET /api/certificates/:id
 * @access  Public
 */
exports.getCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('internship', 'title domain company duration');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    res.status(200).json({
      success: true,
      data: certificate
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Generate certificate
 * @route   POST /api/certificates/generate
 * @access  Private/Admin/Mentor
 */
exports.generateCertificate = async (req, res, next) => {
  try {
    const { enrollmentId } = req.body;

    // Get enrollment with details
    const enrollment = await Enrollment.findById(enrollmentId)
      .populate('user', 'firstName lastName email')
      .populate('internship', 'title domain company duration skills');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    if (enrollment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot generate certificate for incomplete enrollment'
      });
    }

    // Check if certificate already exists
    const existingCertificate = await Certificate.findOne({
      user: enrollment.user._id,
      internship: enrollment.internship._id
    });

    if (existingCertificate) {
      return res.status(400).json({
        success: false,
        message: 'Certificate already exists for this enrollment'
      });
    }

    // Generate PDF
    const certificateData = {
      internName: `${enrollment.user.firstName} ${enrollment.user.lastName}`,
      internshipTitle: enrollment.internship.title,
      domain: enrollment.internship.domain,
      company: enrollment.internship.company,
      completionDate: enrollment.completionDate,
      skills: enrollment.internship.skills,
      score: enrollment.finalScore || 0
    };

    const pdfUrl = await generateCertificatePDF(certificateData);

    // Create certificate record
    const certificate = await Certificate.create({
      user: enrollment.user._id,
      internship: enrollment.internship._id,
      enrollment: enrollmentId,
      certificateUrl: pdfUrl,
      issuedDate: new Date(),
      certificateId: `CERT-${Date.now()}`
    });

    res.status(201).json({
      success: true,
      data: certificate
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify certificate
 * @route   GET /api/certificates/verify/:certificateId
 * @access  Public
 */
exports.verifyCertificate = async (req, res, next) => {
  try {
    const { certificateId } = req.params;

    const result = await verifyCertificate(certificateId);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user certificates
 * @route   GET /api/certificates/user/:userId
 * @access  Private
 */
exports.getUserCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find({ user: req.params.userId })
      .populate('internship', 'title domain company')
      .sort({ issuedDate: -1 });

    res.status(200).json({
      success: true,
      count: certificates.length,
      data: certificates
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Download certificate
 * @route   GET /api/certificates/:id/download
 * @access  Private
 */
exports.downloadCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        downloadUrl: certificate.certificateUrl
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Revoke certificate
 * @route   PUT /api/certificates/:id/revoke
 * @access  Private/Admin
 */
exports.revokeCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    certificate.isRevoked = true;
    await certificate.save();

    res.status(200).json({
      success: true,
      message: 'Certificate revoked successfully',
      data: certificate
    });
  } catch (error) {
    next(error);
  }
};
