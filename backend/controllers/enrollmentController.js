const Enrollment = require('../models/Enrollment');
const Internship = require('../models/Internship');

/**
 * @desc    Get all enrollments
 * @route   GET /api/enrollments
 * @access  Private
 */
exports.getEnrollments = async (req, res, next) => {
  try {
    const { status, internship, user } = req.query;

    const query = {};
    if (status) query.status = status;
    if (internship) query.internship = internship;
    if (user) query.user = user;

    // If user is intern, only show their enrollments
    if (req.user.role === 'intern') {
      query.user = req.user.id;
    }

    const enrollments = await Enrollment.find(query)
      .populate('user', 'firstName lastName email avatar')
      .populate('internship', 'title domain company duration')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single enrollment
 * @route   GET /api/enrollments/:id
 * @access  Private
 */
exports.getEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate('user', 'firstName lastName email avatar')
      .populate('internship');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Check authorization
    if (
      req.user.role === 'intern' &&
      enrollment.user._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this enrollment'
      });
    }

    res.status(200).json({
      success: true,
      data: enrollment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create enrollment
 * @route   POST /api/enrollments
 * @access  Private/Intern
 */
exports.enroll = async (req, res, next) => {
  try {
    const { internship } = req.body;

    // Check if internship exists
    const internshipDoc = await Internship.findById(internship);
    if (!internshipDoc) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: req.user.id,
      internship
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this internship'
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      user: req.user.id,
      internship,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      data: enrollment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update enrollment status
 * @route   PUT /api/enrollments/:id/status
 * @access  Private/Admin/Mentor
 */
exports.updateEnrollmentStatus = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    const updatedEnrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedEnrollment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Drop enrollment
 * @route   DELETE /api/enrollments/:id
 * @access  Private
 */
exports.dropEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    await enrollment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Enrollment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user enrollments
 * @route   GET /api/enrollments/user/:userId
 * @access  Private
 */
exports.getUserEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ user: req.params.userId })
      .populate('internship', 'title domain company duration')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get my enrollments
 * @route   GET /api/enrollments/my-enrollments
 * @access  Private/Intern
 */
exports.getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user.id })
      .populate('internship', 'title domain company duration description thumbnail')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get enrollment progress
 * @route   GET /api/enrollments/:id/progress
 * @access  Private
 */
exports.getEnrollmentProgress = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate('internship', 'title')
      .populate('user', 'firstName lastName');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        enrollment,
        progress: enrollment.progress,
        status: enrollment.status
      }
    });
  } catch (error) {
    next(error);
  }
};
