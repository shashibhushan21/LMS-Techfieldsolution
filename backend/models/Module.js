const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide module title'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: [true, 'Please provide description'],
    maxlength: 1000
  },
  internship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
    required: true
  },
  order: {
    type: Number,
    required: true,
    default: 0
  },
  duration: {
    hours: {
      type: Number,
      default: 0
    },
    minutes: {
      type: Number,
      default: 0
    }
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishDate: {
    type: Date
  },
  lessons: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    order: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      enum: ['video', 'document', 'presentation', 'quiz', 'reading', 'scorm'],
      required: true
    },
    content: {
      type: String // URL, embedded content, or text
    },
    duration: {
      minutes: Number
    },
    resources: [{
      title: String,
      url: String,
      type: String
    }],
    isRequired: {
      type: Boolean,
      default: true
    }
  }],
  resources: [{
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['pdf', 'video', 'link', 'document', 'other'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    description: String
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for assignments
ModuleSchema.virtual('assignments', {
  ref: 'Assignment',
  localField: '_id',
  foreignField: 'module',
  justOne: false
});

// Ensure unique order within internship
ModuleSchema.index({ internship: 1, order: 1 }, { unique: true });

module.exports = mongoose.model('Module', ModuleSchema);
