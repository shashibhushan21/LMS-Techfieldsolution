const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    required: true,
    unique: true
  },
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
  enrollment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment',
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  completionDate: {
    type: Date,
    required: true
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'Pass'],
    default: 'Pass'
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  skills: [{
    type: String,
    trim: true
  }],
  template: {
    type: String,
    default: 'default'
  },
  pdfUrl: {
    type: String
  },
  verificationUrl: {
    type: String
  },
  isRevoked: {
    type: Boolean,
    default: false
  },
  revokedAt: {
    type: Date
  },
  revokedReason: {
    type: String
  },
  metadata: {
    totalModules: Number,
    totalAssignments: Number,
    averageScore: Number,
    duration: String
  }
}, {
  timestamps: true
});

// Generate unique certificate ID
CertificateSchema.pre('save', async function(next) {
  if (!this.certificateId) {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    this.certificateId = `TFS-${year}-${random}`;
  }
  next();
});

// Index for user and internship lookup
CertificateSchema.index({ user: 1, internship: 1 });

module.exports = mongoose.model('Certificate', CertificateSchema);
