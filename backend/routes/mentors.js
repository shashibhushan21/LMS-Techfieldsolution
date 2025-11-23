const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Internship = require('../models/Internship');
const Enrollment = require('../models/Enrollment');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Module = require('../models/Module');
const User = require('../models/User');

/**
 * @desc    Get mentor's assigned internships
 * @route   GET /api/mentors/my-internships
 * @access  Private/Mentor
 */
router.get('/my-internships', protect, authorize('mentor'), async (req, res, next) => {
  try {
    const internships = await Internship.find({ mentor: req.user.id })
      .select('title description domain duration level isActive')
      .lean();

    // Get enrollment counts and module counts for each internship
    const internshipsWithCounts = await Promise.all(
      internships.map(async (internship) => {
        const enrollmentCount = await Enrollment.countDocuments({
          internship: internship._id,
          status: { $in: ['active', 'completed'] }
        });

        const moduleCount = await Module.countDocuments({
          internship: internship._id
        });

        return {
          ...internship,
          enrollmentCount,
          moduleCount
        };
      })
    );

    res.status(200).json({
      success: true,
      count: internshipsWithCounts.length,
      data: internshipsWithCounts
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Get mentor's students (interns)
 * @route   GET /api/mentors/students
 * @access  Private/Mentor
 */
router.get('/students', protect, authorize('mentor'), async (req, res, next) => {
  try {
    // Get all internships mentored by this user
    const myInternships = await Internship.find({ mentor: req.user.id }).distinct('_id');

    // Get all enrollments in these internships
    const enrollments = await Enrollment.find({
      internship: { $in: myInternships },
      status: { $in: ['active', 'completed'] }
    })
      .populate('user', 'firstName lastName email avatar')
      .populate('internship', 'title')
      .lean();

    // Get unique students with additional data
    const studentMap = new Map();

    for (const enrollment of enrollments) {
      if (!enrollment.user) continue;

      const userId = enrollment.user._id.toString();

      if (!studentMap.has(userId)) {
        // Count total enrollments for this student in mentor's internships
        const enrollmentCount = await Enrollment.countDocuments({
          user: enrollment.user._id,
          internship: { $in: myInternships },
          status: 'active'
        });

        // Calculate average score
        const assignmentIds = await Assignment.find({
          internship: { $in: myInternships }
        }).distinct('_id');

        const gradedSubmissions = await Submission.find({
          user: enrollment.user._id,
          assignment: { $in: assignmentIds },
          status: 'graded',
          score: { $exists: true, $ne: null }
        }).select('score totalPoints');

        let averageScore = 0;
        if (gradedSubmissions.length > 0) {
          const totalPercentage = gradedSubmissions.reduce((sum, sub) => {
            const percentage = sub.totalPoints > 0 ? (sub.score / sub.totalPoints) * 100 : 0;
            return sum + percentage;
          }, 0);
          averageScore = Math.round(totalPercentage / gradedSubmissions.length);
        }

        studentMap.set(userId, {
          _id: enrollment.user._id,
          firstName: enrollment.user.firstName,
          lastName: enrollment.user.lastName,
          email: enrollment.user.email,
          avatar: enrollment.user.avatar,
          enrollmentCount,
          averageScore,
          internships: [enrollment.internship]
        });
      } else {
        // Add internship to the list if not already there
        const student = studentMap.get(userId);
        if (!student.internships.some(i => i._id.toString() === enrollment.internship._id.toString())) {
          student.internships.push(enrollment.internship);
        }
      }
    }

    const students = Array.from(studentMap.values());

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Get student details for mentor
 * @route   GET /api/mentors/students/:id
 * @access  Private/Mentor
 */
router.get('/students/:id', protect, authorize('mentor'), async (req, res, next) => {
  try {
    const student = await User.findById(req.params.id).select('-password');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Verify mentor has access to this student
    const myInternships = await Internship.find({ mentor: req.user.id }).distinct('_id');
    const hasAccess = await Enrollment.exists({
      user: req.params.id,
      internship: { $in: myInternships }
    });

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this student'
      });
    }

    // Get student's enrollments in mentor's internships
    const enrollments = await Enrollment.find({
      user: req.params.id,
      internship: { $in: myInternships }
    })
      .populate('internship', 'title domain')
      .lean();

    // Get submissions
    const assignmentIds = await Assignment.find({
      internship: { $in: myInternships }
    }).distinct('_id');

    const submissions = await Submission.find({
      user: req.params.id,
      assignment: { $in: assignmentIds }
    })
      .populate('assignment', 'title totalPoints')
      .sort({ submittedAt: -1 })
      .limit(10)
      .lean();

    res.status(200).json({
      success: true,
      data: {
        student,
        enrollments,
        submissions
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Get submissions for mentor to review
 * @route   GET /api/mentors/submissions
 * @access  Private/Mentor
 */
router.get('/submissions', protect, authorize('mentor'), async (req, res, next) => {
  try {
    const { status } = req.query;

    // Get mentor's internships
    const myInternships = await Internship.find({ mentor: req.user.id }).distinct('_id');

    // Get assignments for these internships
    const assignmentIds = await Assignment.find({
      internship: { $in: myInternships }
    }).distinct('_id');

    // Build query
    const query = { assignment: { $in: assignmentIds } };
    
    if (status && status !== 'all') {
      if (status === 'pending') {
        query.status = 'submitted';
      } else if (status === 'graded') {
        query.status = 'graded';
      }
    }

    const submissions = await Submission.find(query)
      .populate('user', 'firstName lastName email avatar')
      .populate('assignment', 'title totalPoints dueDate')
      .populate({
        path: 'assignment',
        populate: { path: 'internship', select: 'title' }
      })
      .sort({ submittedAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Get single submission details for mentor
 * @route   GET /api/mentors/submissions/:id
 * @access  Private/Mentor
 */
router.get('/submissions/:id', protect, authorize('mentor'), async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('user', 'firstName lastName email avatar')
      .populate('assignment', 'title description totalPoints dueDate internship')
      .populate({
        path: 'assignment',
        populate: { path: 'internship', select: 'title mentor' }
      });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Verify mentor has access
    if (submission.assignment.internship.mentor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this submission'
      });
    }

    res.status(200).json({
      success: true,
      data: submission
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Get mentor dashboard data
 * @route   GET /api/mentors/dashboard
 * @access  Private/Mentor
 */
router.get('/dashboard', protect, authorize('mentor'), async (req, res, next) => {
  try {
    // Get mentor's internships
    const internships = await Internship.find({ mentor: req.user.id })
      .select('title description')
      .lean();

    const internshipIds = internships.map(i => i._id);

    // Get stats
    const totalStudents = await Enrollment.distinct('user', {
      internship: { $in: internshipIds },
      status: { $in: ['active', 'completed'] }
    }).then(users => users.length);

    const assignmentIds = await Assignment.find({
      internship: { $in: internshipIds }
    }).distinct('_id');

    const pendingSubmissions = await Submission.countDocuments({
      assignment: { $in: assignmentIds },
      status: 'submitted'
    });

    // Get graded this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const gradedThisWeek = await Submission.countDocuments({
      assignment: { $in: assignmentIds },
      status: 'graded',
      gradedAt: { $gte: oneWeekAgo }
    });

    // Get enrollment counts for internships
    const internshipsWithCounts = await Promise.all(
      internships.map(async (internship) => {
        const enrollmentCount = await Enrollment.countDocuments({
          internship: internship._id,
          status: { $in: ['active', 'completed'] }
        });

        return {
          ...internship,
          enrollmentCount
        };
      })
    );

    // Get pending submissions list
    const pendingSubmissionsList = await Submission.find({
      assignment: { $in: assignmentIds },
      status: 'submitted'
    })
      .populate('user', 'firstName lastName email')
      .populate('assignment', 'title')
      .sort({ submittedAt: -1 })
      .limit(10)
      .lean();

    // Get recently graded
    const recentGraded = await Submission.find({
      assignment: { $in: assignmentIds },
      status: 'graded'
    })
      .populate('user', 'firstName lastName')
      .populate('assignment', 'title totalPoints')
      .sort({ gradedAt: -1 })
      .limit(5)
      .lean();

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalInternships: internships.length,
          totalStudents,
          pendingSubmissions,
          gradedThisWeek
        },
        internships: internshipsWithCounts,
        pendingSubmissions: pendingSubmissionsList,
        recentGraded
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Get internship details for mentor
 * @route   GET /api/mentors/internships/:id
 * @access  Private/Mentor
 */
router.get('/internships/:id', protect, authorize('mentor'), async (req, res, next) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    // Verify mentor owns this internship
    if (internship.mentor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this internship'
      });
    }

    // Get modules
    const modules = await Module.find({ internship: req.params.id })
      .sort({ orderIndex: 1 })
      .lean();

    // Get assignments
    const assignments = await Assignment.find({ internship: req.params.id })
      .sort({ createdAt: -1 })
      .lean();

    // Get enrollments
    const enrollments = await Enrollment.find({ internship: req.params.id })
      .populate('user', 'firstName lastName email avatar')
      .sort({ createdAt: -1 })
      .lean();

    // Get stats
    const totalStudents = enrollments.length;
    const activeStudents = enrollments.filter(e => e.status === 'active').length;
    const completedStudents = enrollments.filter(e => e.status === 'completed').length;

    res.status(200).json({
      success: true,
      data: {
        internship,
        modules,
        assignments,
        enrollments,
        stats: {
          totalStudents,
          activeStudents,
          completedStudents,
          totalModules: modules.length,
          totalAssignments: assignments.length
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
