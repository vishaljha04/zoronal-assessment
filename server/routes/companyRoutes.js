const express = require('express');
const router = express.Router();
const {
  createCompany,
  getCompanies,
  getCompanyById,
} = require('../controllers/companyController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(getCompanies)
  .post(protect, createCompany);

router.route('/:id')
  .get(getCompanyById);

module.exports = router;
