const Notification = require('../models/Notification');
const sendEmail = require('../config/email');

/**
 * Create a notification for a user
 * @param {Object} data - Notification data
 * @returns {Promise<Object>} - Created notification
 */
exports.createNotification = async (data) => {
  try {
    const notification = await Notification.create(data);
    
    // Emit real-time notification via Socket.IO if io is available
    const io = global.io;
    if (io) {
      io.to(`user_${data.recipient}`).emit('new_notification', notification);
    }

    return notification;
  } catch (error) {
    console.error('Notification creation error:', error);
    throw error;
  }
};

/**
 * Send email notification
 * @param {String} to - Recipient email
 * @param {String} subject - Email subject
 * @param {String} message - Email message
 */
exports.sendEmailNotification = async (to, subject, message) => {
  try {
    await sendEmail({
      to,
      subject,
      html: message
    });
  } catch (error) {
    console.error('Email notification error:', error);
  }
};

/**
 * Notify user about assignment due date
 */
exports.notifyAssignmentDue = async (userId, assignmentTitle, dueDate) => {
  await this.createNotification({
    recipient: userId,
    type: 'assignment_due',
    title: 'Assignment Due Soon',
    message: `Assignment "${assignmentTitle}" is due on ${dueDate.toLocaleDateString()}`,
    priority: 'high'
  });
};

/**
 * Notify user about graded assignment
 */
exports.notifyAssignmentGraded = async (userId, assignmentTitle, score) => {
  await this.createNotification({
    recipient: userId,
    type: 'assignment_graded',
    title: 'Assignment Graded',
    message: `Your assignment "${assignmentTitle}" has been graded. Score: ${score}`,
    priority: 'medium'
  });
};

/**
 * Notify about enrollment status change
 */
exports.notifyEnrollmentStatus = async (userId, internshipTitle, status) => {
  const messages = {
    approved: `Your enrollment in "${internshipTitle}" has been approved!`,
    rejected: `Your enrollment in "${internshipTitle}" was not approved.`
  };

  await this.createNotification({
    recipient: userId,
    type: `enrollment_${status}`,
    title: 'Enrollment Update',
    message: messages[status] || `Your enrollment status has been updated to ${status}`,
    priority: status === 'approved' ? 'high' : 'medium'
  });
};

/**
 * Notify about new announcement
 */
exports.notifyNewAnnouncement = async (userIds, announcementTitle) => {
  const notifications = userIds.map(userId => ({
    recipient: userId,
    type: 'new_announcement',
    title: 'New Announcement',
    message: `New announcement: ${announcementTitle}`,
    priority: 'medium'
  }));

  await Notification.insertMany(notifications);
};

/**
 * Notify about certificate issuance
 */
exports.notifyCertificateIssued = async (userId, internshipTitle, certificateId) => {
  await this.createNotification({
    recipient: userId,
    type: 'certificate_issued',
    title: 'Certificate Issued',
    message: `Congratulations! Your certificate for "${internshipTitle}" has been issued.`,
    data: { certificateId },
    priority: 'high'
  });
};
