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
      .sort({ issueDate: -1 });

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

    // Generate certificate ID
    const certificateId = `CERT-${Date.now()}`;

    // Generate PDF
    const certificateData = {
      internName: `${enrollment.user.firstName} ${enrollment.user.lastName}`,
      internshipTitle: enrollment.internship.title,
      domain: enrollment.internship.domain,
      company: enrollment.internship.company,
      completionDate: enrollment.completionDate,
      skills: enrollment.internship.skills,
      score: enrollment.finalScore || 0,
      certificateId: certificateId
    };

    const pdfUrl = await generateCertificatePDF(certificateData);

    // Create certificate record
    const certificate = await Certificate.create({
      user: enrollment.user._id,
      internship: enrollment.internship._id,
      enrollment: enrollmentId,
      pdfUrl: pdfUrl,
      completionDate: enrollment.completionDate,
      issueDate: new Date(),
      certificateId: certificateId
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
 * @desc    Generate certificate manually (admin override)
 * @route   POST /api/certificates/generate-manual
 * @access  Private/Admin
 */
exports.generateCertificateManual = async (req, res, next) => {
  try {
    const { userId, internshipId } = req.body;
    const User = require('../models/User');
    const Internship = require('../models/Internship');

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify internship exists
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    // Check if certificate already exists
    const existingCertificate = await Certificate.findOne({
      user: userId,
      internship: internshipId
    });

    if (existingCertificate) {
      return res.status(400).json({
        success: false,
        message: 'Certificate already exists for this user and internship'
      });
    }

    // Find or create enrollment
    let enrollment = await Enrollment.findOne({
      user: userId,
      internship: internshipId
    });

    if (!enrollment) {
      // Create a basic enrollment record for certificate tracking
      enrollment = await Enrollment.create({
        user: userId,
        internship: internshipId,
        status: 'completed',
        enrolledAt: new Date(),
        completionDate: new Date()
      });
    }

    // Generate certificate ID
    const certificateId = `CERT-${Date.now()}`;

    // Generate PDF
    const certificateData = {
      internName: `${user.firstName} ${user.lastName}`,
      internshipTitle: internship.title,
      domain: internship.domain,
      company: internship.company || 'TechFieldSolution',
      completionDate: new Date(),
      skills: internship.skills || [],
      score: 0,
      certificateId: certificateId
    };

    const pdfUrl = await generateCertificatePDF(certificateData);

    // Create certificate record
    const certificate = await Certificate.create({
      user: userId,
      internship: internshipId,
      enrollment: enrollment._id,
      pdfUrl: pdfUrl,
      completionDate: new Date(),
      issueDate: new Date(),
      certificateId: certificateId
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
      .sort({ issueDate: -1 });

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
        downloadUrl: certificate.pdfUrl
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
