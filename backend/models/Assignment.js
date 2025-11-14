const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide assignment title'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: [true, 'Please provide description'],
    maxlength: 2000
  },
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  internship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
    required: true
  },
  type: {
    type: String,
    enum: ['project', 'quiz', 'coding', 'essay', 'presentation', 'other'],
    default: 'project'
  },
  dueDate: {
    type: Date,
    required: [true, 'Please provide due date']
  },
  maxScore: {
    type: Number,
    required: true,
    default: 100
  },
  passingScore: {
    type: Number,
    required: true,
    default: 60
  },
  allowLateSubmission: {
    type: Boolean,
    default: false
  },
  lateSubmissionPenalty: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  maxAttempts: {
    type: Number,
    default: 1,
    min: 1
  },
  instructions: {
    type: String,
    maxlength: 5000
  },
  rubric: [{
    criterion: {
      type: String,
      required: true
    },
    maxPoints: {
      type: Number,
      required: true
    },
    description: String
  }],
  allowedFileTypes: [{
    type: String
  }],
  maxFileSize: {
    type: Number,
    default: 10485760 // 10MB in bytes
  },
  requireFileUpload: {
    type: Boolean,
    default: false
  },
  requireRepositoryLink: {
    type: Boolean,
    default: false
  },
  resources: [{
    title: String,
    url: String,
    type: String
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for submissions
AssignmentSchema.virtual('submissions', {
  ref: 'Submission',
  localField: '_id',
  foreignField: 'assignment',
  justOne: false
});

// Index for efficient queries
AssignmentSchema.index({ module: 1, internship: 1 });
AssignmentSchema.index({ dueDate: 1 });

module.exports = mongoose.model('Assignment', AssignmentSchema);
