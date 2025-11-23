const { Conversation, Message } = require('../models/Conversation');

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
      .populate('lastMessage') // Populate the last message reference
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
      .populate('participants', 'firstName lastName avatar role');

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
      const populated = await Conversation.findById(existingConversation._id)
        .populate('participants', 'firstName lastName avatar role')
        .populate('lastMessage');

      return res.status(200).json({
        success: true,
        data: populated
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

    // Create message document
    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user.id,
      content
    });

    // Populate message with sender info and readBy details
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'firstName lastName avatar _id')
      .populate('readBy.user', 'firstName lastName avatar _id');

    // Update conversation last message (handled by post-save hook in model, but we can ensure it here too if needed)
    // The model hook does: await this.model('Conversation').findByIdAndUpdate(this.conversation, { lastMessage: this._id, lastMessageAt: this.createdAt });

    // Return updated conversation with populated fields
    const updatedConversation = await Conversation.findById(conversation._id)
      .populate('participants', 'firstName lastName avatar role')
      .populate({
        path: 'lastMessage',
        populate: { path: 'sender', select: 'firstName lastName avatar' }
      });

    res.status(200).json({
      success: true,
      data: updatedConversation,
      message: populatedMessage
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

    // Delete all messages in this conversation
    await Message.deleteMany({ conversation: conversation._id });
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

    if (!isParticipant && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this conversation'
      });
    }

    // Fetch messages referencing this conversation
    const messages = await Message.find({ conversation: conversation._id })
      .populate('sender', 'firstName lastName avatar')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
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
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is allowed to mark as read (must be in conversation)
    // For simplicity, we assume if they can access the message ID, they can read it, 
    // or we should check conversation participants.
    // Let's check conversation participants:
    const conversation = await Conversation.findById(message.conversation);
    if (conversation && conversation.participants.includes(req.user.id)) {
      // Add user to readBy array if not already there
      const alreadyRead = message.readBy.some(r => r.user.toString() === req.user.id);
      if (!alreadyRead) {
        message.readBy.push({ user: req.user.id });
        await message.save();
      }
    }

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
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Only sender or admin can delete
    if (message.sender.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this message'
      });
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
