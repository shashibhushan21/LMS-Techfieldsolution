const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attemptNumber: {
    type: Number,
    required: true,
    default: 1
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'graded', 'returned', 'resubmitted'],
    default: 'draft'
  },
  submittedAt: {
    type: Date
  },
  content: {
    type: String,
    maxlength: 10000
  },
  files: [{
    originalName: String,
    fileName: String,
    fileUrl: String,
    fileSize: Number,
    mimeType: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  repositoryLink: {
    type: String,
    trim: true
  },
  liveLink: {
    type: String,
    trim: true
  },
  isLate: {
    type: Boolean,
    default: false
  },
  score: {
    type: Number,
    min: 0,
    default: null
  },
  feedback: {
    type: String,
    maxlength: 2000
  },
  rubricScores: [{
    criterion: String,
    points: Number,
    comment: String
  }],
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  gradedAt: {
    type: Date
  },
  isPassed: {
    type: Boolean,
    default: null
  },
  plagiarismCheck: {
    checked: {
      type: Boolean,
      default: false
    },
    score: Number,
    report: String
  }
}, {
  timestamps: true
});

// Compound index to track attempts
SubmissionSchema.index({ assignment: 1, user: 1, attemptNumber: 1 }, { unique: true });

// Check if submission is late
SubmissionSchema.pre('save', async function (next) {
  if (this.isModified('submittedAt') && this.submittedAt) {
    const assignment = await this.model('Assignment').findById(this.assignment);
    if (assignment && this.submittedAt > assignment.dueDate) {
      this.isLate = true;
    }
  }
  next();
});

// Calculate pass/fail when score is set
SubmissionSchema.pre('save', async function (next) {
  if (this.isModified('score') && this.score !== null) {
    const assignment = await this.model('Assignment').findById(this.assignment);
    if (assignment) {
      this.isPassed = this.score >= assignment.passingScore;
    }
  }
  next();
});

module.exports = mongoose.model('Submission', SubmissionSchema);
