const Internship = require('../models/Internship');
const Enrollment = require('../models/Enrollment');
const Module = require('../models/Module');

// @desc    Get all internships
// @route   GET /api/internships
// @access  Public/Private
exports.getInternships = async (req, res, next) => {
  try {
    const { domain, skillLevel, status, featured, search, sort } = req.query;

    // Build query
    let query = {};

    // Filters
    if (domain) query.domain = domain;
    if (skillLevel) query.skillLevel = skillLevel;
    if (status) {
      query.status = status;
    } else {
      // By default show only open internships for non-admin users
      if (!req.user || req.user.role !== 'admin') {
        query.status = 'open';
      }
    }
    if (featured) query.featured = featured === 'true';

    // Search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Sorting
    let sortOptions = '-createdAt';
    if (sort) {
      sortOptions = sort === 'oldest' ? 'createdAt' : sort === 'title' ? 'title' : '-createdAt';
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Internship.countDocuments(query);

    const internships = await Internship.find(query)
      .populate('mentor', 'firstName lastName avatar')
      .sort(sortOptions)
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: internships.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: internships
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single internship
// @route   GET /api/internships/:id
// @access  Public/Private
exports.getInternship = async (req, res, next) => {
  try {
    const internship = await Internship.findById(req.params.id)
      .populate('mentor', 'firstName lastName email avatar bio');

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    // Get modules if user is enrolled or is admin/mentor
    let modules = [];
    if (req.user) {
      const enrollment = await Enrollment.findOne({
        user: req.user.id,
        internship: req.params.id,
        status: { $in: ['approved', 'active', 'completed'] }
      });

      if (enrollment || ['admin', 'mentor'].includes(req.user.role)) {
        modules = await Module.find({ internship: req.params.id })
          .sort('order')
          .populate('assignments');
      }
    }

    res.status(200).json({
      success: true,
      data: {
        ...internship.toJSON(),
        modules
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new internship
// @route   POST /api/internships
// @access  Private (Admin/Mentor)
exports.createInternship = async (req, res, next) => {
  try {
    // Add mentor to req.body
    req.body.mentor = req.user.id;

    const internship = await Internship.create(req.body);

    res.status(201).json({
      success: true,
      data: internship
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update internship
// @route   PUT /api/internships/:id
// @access  Private (Admin/Mentor)
exports.updateInternship = async (req, res, next) => {
  try {
    let internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    // Make sure user is internship mentor or admin
    if (internship.mentor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this internship'
      });
    }

    internship = await Internship.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: internship
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete internship
// @route   DELETE /api/internships/:id
// @access  Private (Admin)
exports.deleteInternship = async (req, res, next) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    await internship.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Internship deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my internships (as mentor)
// @route   GET /api/internships/me/my-internships
// @access  Private (Mentor)
exports.getMyInternships = async (req, res, next) => {
  try {
    const internships = await Internship.find({ mentor: req.user.id })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: internships.length,
      data: internships
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search internships with advanced filters
// @route   GET /api/internships/search
// @access  Public
exports.searchInternships = async (req, res, next) => {
  try {
    const {
      q,
      domain,
      skillLevel,
      minDuration,
      maxDuration,
      isRemote,
      featured
    } = req.query;

    let query = { status: 'open' };

    if (q) {
      query.$text = { $search: q };
    }

    if (domain) query.domain = domain;
    if (skillLevel) query.skillLevel = skillLevel;
    if (isRemote !== undefined) query.isRemote = isRemote === 'true';
    if (featured !== undefined) query.featured = featured === 'true';

    if (minDuration || maxDuration) {
      query['duration.weeks'] = {};
      if (minDuration) query['duration.weeks'].$gte = parseInt(minDuration);
      if (maxDuration) query['duration.weeks'].$lte = parseInt(maxDuration);
    }

    const internships = await Internship.find(query)
      .populate('mentor', 'firstName lastName')
      .sort('-featured -createdAt')
      .limit(20);

    res.status(200).json({
      success: true,
      count: internships.length,
      data: internships
    });
  } catch (error) {
    next(error);
  }
};
