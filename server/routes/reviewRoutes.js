const express = require('express');
const router = express.Router();
const {
  addReview,
  getCompanyReviews,
  likeReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.route('/:companyId')
  .get(getCompanyReviews)
  .post(protect, addReview);

router.patch('/like/:reviewId', likeReview);

module.exports = router;
