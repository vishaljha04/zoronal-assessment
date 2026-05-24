const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [60, 'Name cannot exceed 60 characters'],
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [120, 'Subject cannot exceed 120 characters'],
  },
  reviewText: {
    type: String,
    required: [true, 'Review text is required'],
    trim: true,
    maxlength: [2000, 'Review cannot exceed 2000 characters'],
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
  },
  likes: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Index for faster queries
reviewSchema.index({ companyId: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
