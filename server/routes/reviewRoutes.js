const express = require('express');
const router = express.Router();
const {
  addReview,
  getCompanyReviews,
  likeReview,
} = require('../controllers/reviewController');

router.route('/:companyId')
  .get(getCompanyReviews)
  .post(addReview);

router.patch('/like/:reviewId', likeReview);

module.exports = router;
