const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/fileUploadService');
const bcrypt = require('bcryptjs');

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 */
exports.getUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;

    // Build query
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: users
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single user
 * @route   GET /api/users/:id
 * @access  Private
 */
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Users can only view their own profile unless admin
    if (req.user.id !== user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this user'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create user
 * @route   POST /api/users
 * @access  Private/Admin
 */
exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Private
 */
exports.updateUser = async (req, res, next) => {
  try {
    // Users can only update their own profile unless admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this user'
      });
    }

    // Don't allow role or password update through this route for non-admins
    if (req.user.role !== 'admin') {
      delete req.body.role;
      delete req.body.password;
    }

    // If password is empty string (from frontend form), remove it so it doesn't trigger validation or overwrite
    if (!req.body.password) {
      delete req.body.password;
    } else {
      // Hash password if it exists
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload resume
 * @route   POST /api/users/:id/resume
 * @access  Private
 */
exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    // Users can only upload to their own profile
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to upload for this user'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete old resume if exists
    if (user.resume) {
      await deleteFromCloudinary(user.resume);
    }

    // Upload new resume
    const resumeUrl = await uploadToCloudinary(req.file, 'uploads/resumes');

    user.resume = resumeUrl;
    await user.save();

    res.status(200).json({
      success: true,
      data: { resume: resumeUrl }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get intern profile with enrollments
 * @route   GET /api/users/:id/profile
 * @access  Public
 */
exports.getInternProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password -email');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role !== 'intern') {
      return res.status(400).json({
        success: false,
        message: 'This user is not an intern'
      });
    }

    // Get enrollments with internship details
    const enrollments = await Enrollment.find({ user: user._id })
      .populate('internship', 'title domain company')
      .select('status progress completionDate');

    res.status(200).json({
      success: true,
      data: {
        user,
        enrollments
      }
    });
  } catch (error) {
    next(error);
  }
};
