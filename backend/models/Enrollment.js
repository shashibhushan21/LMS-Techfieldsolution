const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  internship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'active', 'completed', 'dropped'],
    default: 'pending'
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  approvedDate: {
    type: Date
  },
  completionDate: {
    type: Date
  },
  progressPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  totalModulesCompleted: {
    type: Number,
    default: 0
  },
  totalAssignmentsSubmitted: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  certificateIssued: {
    type: Boolean,
    default: false
  },
  certificateId: {
    type: String
  },
  notes: {
    type: String,
    maxlength: 1000
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate enrollments
EnrollmentSchema.index({ user: 1, internship: 1 }, { unique: true });

// Update enrollment count on internship
EnrollmentSchema.post('save', async function() {
  if (this.status === 'approved' || this.status === 'active') {
    await this.model('Internship').findByIdAndUpdate(
      this.internship,
      { $inc: { currentEnrollments: 1 } }
    );
  }
});

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
