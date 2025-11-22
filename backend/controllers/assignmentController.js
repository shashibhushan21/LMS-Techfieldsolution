const Assignment = require('../models/Assignment');
const Module = require('../models/Module');

/**
 * @desc    Get all assignments
 * @route   GET /api/assignments
 * @access  Private
 */
exports.getAssignments = async (req, res, next) => {
  try {
    const { module, internship } = req.query;

    const query = {};
    if (module) query.module = module;
    if (internship) query.internship = internship;

    const assignments = await Assignment.find(query)
      .populate('module', 'title')
      .populate('internship', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single assignment
 * @route   GET /api/assignments/:id
 * @access  Private
 */
exports.getAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('module', 'title description')
      .populate('internship', 'title domain');

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create assignment
 * @route   POST /api/assignments
 * @access  Private/Admin/Mentor
 */
exports.createAssignment = async (req, res, next) => {
  try {
    const { module } = req.body;

    // Verify module exists
    const moduleDoc = await Module.findById(module);
    if (!moduleDoc) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    // Set internship from module
    req.body.internship = moduleDoc.internship;

    // Set createdBy to current user
    req.body.createdBy = req.user.id;

    const assignment = await Assignment.create(req.body);

    res.status(201).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update assignment
 * @route   PUT /api/assignments/:id
 * @access  Private/Admin/Mentor
 */
exports.updateAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedAssignment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete assignment
 * @route   DELETE /api/assignments/:id
 * @access  Private/Admin/Mentor
 */
exports.deleteAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Delete all submissions associated with this assignment
    const Submission = require('../models/Submission');
    await Submission.deleteMany({ assignment: req.params.id });

    await assignment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Assignment and associated submissions deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get assignments by module
 * @route   GET /api/assignments/module/:moduleId
 * @access  Private
 */
exports.getModuleAssignments = async (req, res, next) => {
  try {
    const assignments = await Assignment.find({ module: req.params.moduleId })
      .populate('module', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get my assignments (for interns)
 * @route   GET /api/assignments/my-assignments
 * @access  Private/Intern
 */
exports.getMyAssignments = async (req, res, next) => {
  try {
    const Enrollment = require('../models/Enrollment');
    const Submission = require('../models/Submission');

    // Get user's enrollments
    const enrollments = await Enrollment.find({ user: req.user.id });
    const internshipIds = enrollments.map(e => e.internship);

    // Get assignments for those internships
    const assignments = await Assignment.find({ internship: { $in: internshipIds } })
      .populate('module', 'title')
      .populate('internship', 'title')
      .sort({ dueDate: 1 });

    // Check submission status for each assignment
    const assignmentsWithStatus = await Promise.all(
      assignments.map(async (assignment) => {
        const submission = await Submission.findOne({
          user: req.user.id,
          assignment: assignment._id
        });

        return {
          ...assignment.toObject(),
          submissionStatus: submission ? submission.status : 'not_submitted',
          score: submission?.score
        };
      })
    );

    res.status(200).json({
      success: true,
      count: assignmentsWithStatus.length,
      data: assignmentsWithStatus
    });
  } catch (error) {
    next(error);
  }
};
