const Enrollment = require('../models/Enrollment');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const User = require('../models/User');
const Internship = require('../models/Internship');

/**
 * @desc    Get admin dashboard analytics
 * @route   GET /api/analytics/dashboard/admin
 * @access  Private/Admin
 */
exports.getAdminDashboard = async (req, res, next) => {
  try {
    // Total counts
    const totalUsers = await User.countDocuments();
    const totalInterns = await User.countDocuments({ role: 'intern' });
    const totalMentors = await User.countDocuments({ role: 'mentor' });
    const totalInternships = await Internship.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();

    // Enrollment stats
    const activeEnrollments = await Enrollment.countDocuments({ status: 'active' });
    const completedEnrollments = await Enrollment.countDocuments({ status: 'completed' });

    // Assignment stats
    const totalAssignments = await Assignment.countDocuments();
    const totalSubmissions = await Submission.countDocuments();
    const pendingSubmissions = await Submission.countDocuments({ status: 'submitted' });

    // Recent enrollments (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentEnrollmentsCount = await Enrollment.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get recent enrollments with details
    const recentEnrollmentsList = await Enrollment.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'firstName lastName email')
      .populate('internship', 'title');

    // Get recent submissions with details
    const recentSubmissionsList = await Submission.find()
      .sort({ submittedAt: -1 })
      .limit(10)
      .populate('user', 'firstName lastName email')
      .populate('assignment', 'title');

    // Popular internships
    const popularInternships = await Enrollment.aggregate([
      { $group: { _id: '$internship', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'internships',
          localField: '_id',
          foreignField: '_id',
          as: 'internship'
        }
      },
      { $unwind: '$internship' },
      {
        $project: {
          title: '$internship.title',
          domain: '$internship.domain',
          enrollmentCount: '$count'
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalInterns,
          totalMentors,
          totalInternships,
          totalEnrollments,
          activeEnrollments,
          completedEnrollments
        },
        assignments: {
          totalAssignments,
          totalSubmissions,
          pendingSubmissions
        },
        recent: {
          enrollmentsLast30Days: recentEnrollmentsCount
        },
        popularInternships,
        recentEnrollments: recentEnrollmentsList,
        recentSubmissions: recentSubmissionsList
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get mentor dashboard analytics
 * @route   GET /api/analytics/dashboard/mentor
 * @access  Private/Mentor
 */
exports.getMentorDashboard = async (req, res, next) => {
  try {
    // Internships mentored by this user
    const myInternships = await Internship.find({ mentor: req.user.id });
    const internshipIds = myInternships.map(i => i._id);

    // Enrollments in my internships
    const totalEnrollments = await Enrollment.countDocuments({
      internship: { $in: internshipIds }
    });

    const activeEnrollments = await Enrollment.countDocuments({
      internship: { $in: internshipIds },
      status: 'active'
    });

    // Assignments and submissions
    const totalAssignments = await Assignment.countDocuments({
      internship: { $in: internshipIds }
    });

    const pendingSubmissions = await Submission.countDocuments({
      assignment: { $in: await Assignment.find({ internship: { $in: internshipIds } }).distinct('_id') },
      status: 'submitted'
    });

    // Recent submissions to review
    const recentSubmissions = await Submission.find({
      assignment: { $in: await Assignment.find({ internship: { $in: internshipIds } }).distinct('_id') },
      status: 'submitted'
    })
      .populate('user', 'firstName lastName avatar')
      .populate('assignment', 'title')
      .sort({ submittedAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          myInternships: myInternships.length,
          totalEnrollments,
          activeEnrollments,
          totalAssignments,
          pendingSubmissions
        },
        recentSubmissions
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get intern dashboard analytics
 * @route   GET /api/analytics/dashboard/intern
 * @access  Private/Intern
 */
exports.getInternDashboard = async (req, res, next) => {
  try {
    // My enrollments
    const enrollments = await Enrollment.find({ user: req.user.id })
      .populate('internship', 'title domain');

    const activeEnrollments = enrollments.filter(e => e.status === 'active');
    const completedEnrollments = enrollments.filter(e => e.status === 'completed');

    // My submissions
    const totalSubmissions = await Submission.countDocuments({ user: req.user.id });
    const gradedSubmissions = await Submission.countDocuments({
      user: req.user.id,
      status: 'graded'
    });

    // Average score
    const submissions = await Submission.find({
      user: req.user.id,
      status: 'graded',
      score: { $exists: true }
    });

    const averageScore = submissions.length > 0
      ? submissions.reduce((sum, s) => sum + s.score, 0) / submissions.length
      : 0;

    // Progress by enrollment
    const progressPromises = enrollments.map(async (enrollment) => {
      if (!enrollment.internship) return null;

      const assignmentCount = await Assignment.countDocuments({
        internship: enrollment.internship._id
      });

      const submittedCount = await Submission.countDocuments({
        user: req.user.id,
        assignment: { $in: await Assignment.find({ internship: enrollment.internship._id }).distinct('_id') }
      });

      return {
        internship: {
          _id: enrollment.internship._id,
          title: enrollment.internship.title
        },
        progress: enrollment.progress,
        assignmentsCompleted: `${submittedCount}/${assignmentCount}`,
        totalAssignments: assignmentCount,
        completedAssignments: submittedCount
      };
    });

    const progress = (await Promise.all(progressPromises)).filter(p => p !== null);

    // Recent assignments (last 5 assignments from active enrollments)
    const activeInternshipIds = activeEnrollments.map(e => e.internship._id);
    const recentAssignments = await Assignment.find({
      internship: { $in: activeInternshipIds }
    })
      .populate('internship', 'title')
      .sort({ dueDate: -1 })
      .limit(5)
      .lean();

    // Get submission status for each assignment
    const assignmentsWithStatus = await Promise.all(
      recentAssignments.map(async (assignment) => {
        const submission = await Submission.findOne({
          assignment: assignment._id,
          user: req.user.id
        }).select('status score submittedAt');

        return {
          ...assignment,
          submission: submission || null
        };
      })
    );

    // Recent certificates (for completed enrollments)
    const Certificate = require('../models/Certificate');
    const recentCertificates = await Certificate.find({
      user: req.user.id
    })
      .populate('internship', 'title')
      .sort({ issueDate: -1 })
      .limit(3)
      .lean();

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalEnrollments: enrollments.length,
          activeEnrollments: activeEnrollments.length,
          completedEnrollments: completedEnrollments.length,
          totalSubmissions,
          gradedSubmissions,
          averageScore: Math.round(averageScore * 10) / 10
        },
        progress,
        recentAssignments: assignmentsWithStatus,
        recentCertificates
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard stats (general)
 * @route   GET /api/analytics/stats
 * @access  Private
 */
exports.getDashboardStats = async (req, res, next) => {
  try {
    // Role-based stats
    if (req.user.role === 'admin') {
      return exports.getAdminDashboard(req, res, next);
    } else if (req.user.role === 'mentor') {
      return exports.getMentorDashboard(req, res, next);
    } else if (req.user.role === 'intern') {
      return exports.getInternDashboard(req, res, next);
    }

    res.status(403).json({
      success: false,
      message: 'Not authorized'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get internship analytics
 * @route   GET /api/analytics/internship/:id
 * @access  Private/Admin/Mentor
 */
exports.getInternshipAnalytics = async (req, res, next) => {
  try {
    const internshipId = req.params.id;

    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    const totalEnrollments = await Enrollment.countDocuments({ internship: internshipId });
    const activeEnrollments = await Enrollment.countDocuments({ internship: internshipId, status: 'active' });
    const completedEnrollments = await Enrollment.countDocuments({ internship: internshipId, status: 'completed' });

    const assignments = await Assignment.countDocuments({ internship: internshipId });
    const submissions = await Submission.countDocuments({
      assignment: { $in: await Assignment.find({ internship: internshipId }).distinct('_id') }
    });

    res.status(200).json({
      success: true,
      data: {
        internship: {
          title: internship.title,
          domain: internship.domain
        },
        enrollments: {
          total: totalEnrollments,
          active: activeEnrollments,
          completed: completedEnrollments
        },
        assignments,
        submissions
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Export analytics report
 * @route   GET /api/analytics/export/:type
 * @access  Private/Admin
 */
exports.exportReport = async (req, res, next) => {
  try {
    const { type } = req.params;

    // Placeholder for report export functionality
    res.status(200).json({
      success: true,
      message: `${type} report export initiated`,
      data: {
        reportType: type,
        generatedAt: new Date()
      }
    });
  } catch (error) {
    next(error);
  }
};
