const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['direct', 'group', 'internship', 'assignment'],
    default: 'direct'
  },
  title: {
    type: String,
    trim: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  internship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship'
  },
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment'
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const MessageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    maxlength: 2000
  },
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileSize: Number,
    mimeType: String
  }],
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Update conversation's last message
MessageSchema.post('save', async function() {
  await this.model('Conversation').findByIdAndUpdate(
    this.conversation,
    {
      lastMessage: this._id,
      lastMessageAt: this.createdAt
    }
  );
});

// Index for efficient queries
ConversationSchema.index({ participants: 1 });
MessageSchema.index({ conversation: 1, createdAt: -1 });

const Conversation = mongoose.model('Conversation', ConversationSchema);
const Message = mongoose.model('Message', MessageSchema);

module.exports = { Conversation, Message };
