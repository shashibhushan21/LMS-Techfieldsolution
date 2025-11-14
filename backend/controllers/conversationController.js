const Conversation = require('../models/Conversation');

/**
 * @desc    Get all conversations for logged in user
 * @route   GET /api/conversations
 * @access  Private
 */
exports.getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id
    })
      .populate('participants', 'firstName lastName avatar role')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single conversation
 * @route   GET /api/conversations/:id
 * @access  Private
 */
exports.getConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate('participants', 'firstName lastName avatar role')
      .populate('messages.sender', 'firstName lastName avatar');

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Check if user is participant
    const isParticipant = conversation.participants.some(
      (p) => p._id.toString() === req.user.id
    );

    if (!isParticipant && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this conversation'
      });
    }

    res.status(200).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create conversation
 * @route   POST /api/conversations
 * @access  Private
 */
exports.createConversation = async (req, res, next) => {
  try {
    const { participants } = req.body;

    // Add current user to participants if not included
    if (!participants.includes(req.user.id)) {
      participants.push(req.user.id);
    }

    // Check if conversation already exists with these participants
    const existingConversation = await Conversation.findOne({
      participants: { $all: participants, $size: participants.length }
    });

    if (existingConversation) {
      return res.status(200).json({
        success: true,
        data: existingConversation
      });
    }

    const conversation = await Conversation.create({ participants });

    const populatedConversation = await Conversation.findById(conversation._id)
      .populate('participants', 'firstName lastName avatar role');

    res.status(201).json({
      success: true,
      data: populatedConversation
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Send message
 * @route   POST /api/conversations/:id/messages
 * @access  Private
 */
exports.sendMessage = async (req, res, next) => {
  try {
    const { content } = req.body;

    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Check if user is participant
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user.id
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send messages in this conversation'
      });
    }

    conversation.messages.push({
      sender: req.user.id,
      content,
      createdAt: new Date()
    });

    conversation.lastMessage = content;
    await conversation.save();

    const updatedConversation = await Conversation.findById(conversation._id)
      .populate('participants', 'firstName lastName avatar role')
      .populate('messages.sender', 'firstName lastName avatar');

    res.status(200).json({
      success: true,
      data: updatedConversation
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete conversation
 * @route   DELETE /api/conversations/:id
 * @access  Private
 */
exports.deleteConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Only participants or admin can delete
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user.id
    );

    if (!isParticipant && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this conversation'
      });
    }

    await conversation.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Conversation deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get messages in conversation
 * @route   GET /api/conversations/:id/messages
 * @access  Private
 */
exports.getMessages = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate('messages.sender', 'firstName lastName avatar');

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Check if user is participant
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user.id
    );

    if (!isParticipant && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this conversation'
      });
    }

    res.status(200).json({
      success: true,
      count: conversation.messages.length,
      data: conversation.messages
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark message as read
 * @route   PUT /api/conversations/messages/:messageId/read
 * @access  Private
 */
exports.markAsRead = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({
      'messages._id': req.params.messageId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    const message = conversation.messages.id(req.params.messageId);
    message.isRead = true;
    await conversation.save();

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete message
 * @route   DELETE /api/conversations/messages/:messageId
 * @access  Private
 */
exports.deleteMessage = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({
      'messages._id': req.params.messageId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    const message = conversation.messages.id(req.params.messageId);

    // Only sender or admin can delete
    if (message.sender.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this message'
      });
    }

    message.remove();
    await conversation.save();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
