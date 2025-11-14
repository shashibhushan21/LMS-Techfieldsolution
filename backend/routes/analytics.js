const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getInternDashboard,
  getMentorDashboard,
  getAdminDashboard,
  getInternshipAnalytics,
  exportReport
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

// Role-specific dashboards
router.get('/dashboard/intern', protect, authorize('intern'), getInternDashboard);
router.get('/dashboard/mentor', protect, authorize('mentor'), getMentorDashboard);
router.get('/dashboard/admin', protect, authorize('admin'), getAdminDashboard);

// General analytics
router.get('/stats', protect, getDashboardStats);
router.get('/internship/:id', protect, authorize('admin', 'mentor'), getInternshipAnalytics);

// Export reports
router.get('/export/:type', protect, authorize('admin'), exportReport);

module.exports = router;
