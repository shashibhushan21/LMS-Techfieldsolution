const Announcement = require('../models/Announcement');

/**
 * @desc    Get all announcements
 * @route   GET /api/announcements
 * @access  Private
 */
exports.getAnnouncements = async (req, res, next) => {
  try {
    const { targetAudience, internship } = req.query;

    const query = {};
    if (targetAudience) query.targetAudience = targetAudience;
    if (internship) query.internship = internship;

    // Interns only see announcements for all or their role
    if (req.user.role === 'intern') {
      query.$or = [
        { targetAudience: 'all' },
        { targetAudience: 'interns' }
      ];
    }

    const announcements = await Announcement.find(query)
      .populate('author', 'firstName lastName avatar')
      .populate('internship', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: announcements.length,
      data: announcements
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single announcement
 * @route   GET /api/announcements/:id
 * @access  Private
 */
exports.getAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('author', 'firstName lastName avatar')
      .populate('internship', 'title domain');

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    res.status(200).json({
      success: true,
      data: announcement
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create announcement
 * @route   POST /api/announcements
 * @access  Private/Admin/Mentor
 */
exports.createAnnouncement = async (req, res, next) => {
  try {
    req.body.author = req.user.id;

    const announcement = await Announcement.create(req.body);

    // Create notifications for target audience
    const Notification = require('../models/Notification');
    const User = require('../models/User');

    let query = {};
    if (req.body.targetAudience === 'interns') {
      query.role = 'intern';
    } else if (req.body.targetAudience === 'mentors') {
      query.role = 'mentor';
    } else if (req.body.targetAudience === 'all') {
      query.role = { $in: ['intern', 'mentor'] };
    }

    if (Object.keys(query).length > 0) {
      const users = await User.find(query).select('_id');

      const notifications = users.map(user => ({
        recipient: user._id,
        sender: req.user.id,
        type: 'new_announcement',
        title: 'New Announcement: ' + announcement.title,
        message: announcement.content.substring(0, 100) + (announcement.content.length > 100 ? '...' : ''),
        data: { announcementId: announcement._id },
        link: '/dashboard', // Or a specific announcement page if it exists
        priority: announcement.type === 'urgent' ? 'high' : 'medium'
      }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    }

    res.status(201).json({
      success: true,
      data: announcement
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update announcement
 * @route   PUT /api/announcements/:id
 * @access  Private/Admin/Mentor
 */
exports.updateAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    // Only author or admin can update
    if (
      announcement.author.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this announcement'
      });
    }

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedAnnouncement
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete announcement
 * @route   DELETE /api/announcements/:id
 * @access  Private/Admin/Mentor
 */
exports.deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    // Only author or admin can delete
    if (
      announcement.author.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this announcement'
      });
    }

    await announcement.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark announcement as read
 * @route   PUT /api/announcements/:id/read
 * @access  Private
 */
exports.markAnnouncementAsRead = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Announcement marked as read',
      data: announcement
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Pin/Unpin announcement
 * @route   PATCH /api/announcements/:id/pin
 * @access  Private/Admin/Mentor
 */
exports.pinAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    announcement.isPinned = !announcement.isPinned;
    await announcement.save();

    res.status(200).json({
      success: true,
      data: announcement
    });
  } catch (error) {
    next(error);
  }
};
