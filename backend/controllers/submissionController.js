const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/fileUploadService');

/**
 * @desc    Get all submissions
 * @route   GET /api/submissions
 * @access  Private
 */
exports.getSubmissions = async (req, res, next) => {
  try {
    const { assignment, user, status } = req.query;

    const query = {};
    if (assignment) query.assignment = assignment;
    if (user) query.user = user;
    if (status) query.status = status;

    // If user is intern, only show their submissions
    if (req.user.role === 'intern') {
      query.user = req.user.id;
    }

    const submissions = await Submission.find(query)
      .populate('user', 'firstName lastName email avatar')
      .populate('assignment', 'title dueDate maxScore')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single submission
 * @route   GET /api/submissions/:id
 * @access  Private
 */
exports.getSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('user', 'firstName lastName email avatar')
      .populate('assignment')
      .populate('reviewedBy', 'firstName lastName');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Check authorization
    if (
      req.user.role === 'intern' &&
      submission.user._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this submission'
      });
    }

    res.status(200).json({
      success: true,
      data: submission
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit assignment
 * @route   POST /api/submissions
 * @access  Private/Intern
 */
exports.submitAssignment = async (req, res, next) => {
  try {
    const { assignment, submissionText, repositoryLink, liveLink } = req.body;

    // Verify assignment exists
    const assignmentDoc = await Assignment.findById(assignment);
    if (!assignmentDoc) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Check if already submitted
    const existingSubmission = await Submission.findOne({
      user: req.user.id,
      assignment
    });

    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message: 'Assignment already submitted. Use update to resubmit.'
      });
    }

    // Handle file upload if present
    let filesArray = [];
    if (req.files && req.files.length > 0) {
      const { uploadMultipleToCloudinary } = require('../services/fileUploadService');
      const fileUrls = await uploadMultipleToCloudinary(req.files, 'uploads/assignments');

      // Format files to match the schema
      filesArray = req.files.map((file, index) => ({
        originalName: file.originalname,
        fileName: file.filename || `file_${Date.now()}_${index}`,
        fileUrl: fileUrls[index],
        fileSize: file.size,
        mimeType: file.mimetype,
        uploadedAt: new Date()
      }));
    }

    const submission = await Submission.create({
      user: req.user.id,
      assignment,
      content: submissionText || req.body.content || '',
      repositoryLink: repositoryLink || '',
      liveLink: liveLink || '',
      files: filesArray,
      status: 'submitted',
      submittedAt: new Date()
    });

    res.status(201).json({
      success: true,
      data: submission
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update submission (resubmit)
 * @route   PUT /api/submissions/:id
 * @access  Private/Intern
 */
exports.updateSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Only allow intern to update their own submission
    if (submission.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this submission'
      });
    }

    // Handle new file upload
    if (req.files && req.files.length > 0) {
      // Delete old file
      if (submission.fileUrl) {
        await deleteFromCloudinary(submission.fileUrl);
      }
      const { uploadMultipleToCloudinary } = require('../services/fileUploadService');
      const fileUrls = await uploadMultipleToCloudinary(req.files, 'uploads/assignments');
      submission.fileUrl = fileUrls[0] || submission.fileUrl;
    }

    submission.content = req.body.content || submission.content;
    submission.submittedAt = new Date();
    submission.status = 'submitted';

    await submission.save();

    res.status(200).json({
      success: true,
      data: submission
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Grade submission
 * @route   PUT /api/submissions/:id/grade
 * @access  Private/Mentor/Admin
 */
exports.gradeSubmission = async (req, res, next) => {
  try {
    const { score, feedback } = req.body;

    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    submission.score = score;
    submission.feedback = feedback;
    submission.status = 'graded';
    submission.reviewedBy = req.user.id;
    submission.reviewedAt = new Date();

    await submission.save();

    res.status(200).json({
      success: true,
      data: submission
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete submission
 * @route   DELETE /api/submissions/:id
 * @access  Private/Admin
 */
exports.deleteSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Delete file from Cloudinary
    if (submission.fileUrl) {
      await deleteFromCloudinary(submission.fileUrl);
    }

    await submission.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Submission deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get my submissions (for interns)
 * @route   GET /api/submissions/my-submissions
 * @access  Private/Intern
 */
exports.getMySubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ user: req.user.id })
      .populate('assignment', 'title dueDate maxScore')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    next(error);
  }
};
