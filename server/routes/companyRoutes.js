const express = require('express');
const router = express.Router();
const {
  createCompany,
  getCompanies,
  getCompanyById,
} = require('../controllers/companyController');

router.route('/')
  .get(getCompanies)
  .post(createCompany);

router.route('/:id')
  .get(getCompanyById);

module.exports = router;
