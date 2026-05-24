const Review = require('../models/Review');
const Company = require('../models/Company');
const asyncHandler = require('../utils/asyncHandler');

// Helper to recalculate company stats
const updateCompanyStats = async (companyId) => {
  const stats = await Review.aggregate([
    { $match: { companyId: new (require('mongoose').Types.ObjectId)(companyId) } },
    {
      $group: {
        _id: '$companyId',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const update = stats.length > 0
    ? {
        averageRating: Math.round(stats[0].averageRating * 10) / 10,
        totalReviews: stats[0].totalReviews,
      }
    : { averageRating: 0, totalReviews: 0 };

  await Company.findByIdAndUpdate(companyId, update);
};

// @desc    Add a review for a company
// @route   POST /api/reviews/:companyId
// @access  Public
const addReview = asyncHandler(async (req, res) => {
  const { fullName, subject, reviewText, rating } = req.body;
  const { companyId } = req.params;

  const company = await Company.findById(companyId);
  if (!company) {
    res.status(404);
    throw new Error('Company not found');
  }

  if (!fullName || !subject || !reviewText || !rating) {
    res.status(400);
    throw new Error('All review fields are required');
  }

  const review = await Review.create({
    companyId,
    userId: req.user._id,
    fullName,
    subject,
    reviewText,
    rating: Number(rating),
  });

  // Update company stats
  await updateCompanyStats(companyId);

  res.status(201).json({
    success: true,
    data: review,
  });
});

// @desc    Get all reviews for a company
// @route   GET /api/reviews/:companyId
// @access  Public
const getCompanyReviews = asyncHandler(async (req, res) => {
  const { companyId } = req.params;
  const {
    sort = 'latest',
    page = 1,
    limit = 10,
  } = req.query;

  const company = await Company.findById(companyId);
  if (!company) {
    res.status(404);
    throw new Error('Company not found');
  }

  let sortOption = {};
  switch (sort) {
    case 'latest':
      sortOption = { createdAt: -1 };
      break;
    case 'highest':
      sortOption = { rating: -1, createdAt: -1 };
      break;
    case 'lowest':
      sortOption = { rating: 1, createdAt: -1 };
      break;
    case 'most-liked':
      sortOption = { likes: -1, createdAt: -1 };
      break;
    default:
      sortOption = { createdAt: -1 };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const reviews = await Review.find({ companyId })
    .sort(sortOption)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Review.countDocuments({ companyId });

  res.json({
    success: true,
    data: reviews,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

// @desc    Like a review
// @route   PATCH /api/reviews/like/:reviewId
// @access  Public
const likeReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.reviewId);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  review.likes = (review.likes || 0) + 1;
  await review.save();

  res.json({
    success: true,
    data: review,
  });
});

module.exports = {
  addReview,
  getCompanyReviews,
  likeReview,
};
