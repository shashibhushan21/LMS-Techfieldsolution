const mongoose = require('mongoose');

const InternshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide internship title'],
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please provide description'],
    maxlength: 2000
  },
  domain: {
    type: String,
    required: [true, 'Please provide domain'],
    enum: [
      'software-development',
      'web-development',
      'mobile-development',
      'data-science',
      'machine-learning',
      'ui-ux-design',
      'digital-marketing',
      'business-analytics',
      'cybersecurity',
      'cloud-computing',
      'devops',
      'other'
    ]
  },
  skillLevel: {
    type: String,
    required: [true, 'Please provide skill level'],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  duration: {
    weeks: {
      type: Number,
      required: [true, 'Please provide duration in weeks']
    },
    hours: {
      type: Number,
      default: 0
    }
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide end date']
  },
  applicationDeadline: {
    type: Date,
    required: [true, 'Please provide application deadline']
  },
  status: {
    type: String,
    enum: ['draft', 'open', 'closed', 'archived'],
    default: 'draft'
  },
  maxInterns: {
    type: Number,
    default: null
  },
  currentEnrollments: {
    type: Number,
    default: 0
  },
  prerequisites: [{
    type: String,
    trim: true
  }],
  learningOutcomes: [{
    type: String,
    trim: true
  }],
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coverImage: {
    type: String,
    default: 'default-cover.jpg'
  },
  tags: [{
    type: String,
    trim: true
  }],
  certificateTemplate: {
    type: String,
    default: 'default'
  },
  passingScore: {
    type: Number,
    default: 70,
    min: 0,
    max: 100
  },
  isRemote: {
    type: Boolean,
    default: true
  },
  location: {
    type: String,
    trim: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug from title
InternshipSchema.pre('save', function(next) {
  if (!this.isModified('title')) {
    next();
  }
  this.slug = this.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  next();
});

// Virtual for modules
InternshipSchema.virtual('modules', {
  ref: 'Module',
  localField: '_id',
  foreignField: 'internship',
  justOne: false
});

// Virtual for enrollments
InternshipSchema.virtual('enrollments', {
  ref: 'Enrollment',
  localField: '_id',
  foreignField: 'internship',
  justOne: false
});

module.exports = mongoose.model('Internship', InternshipSchema);
