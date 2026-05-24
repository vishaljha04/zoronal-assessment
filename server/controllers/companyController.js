const Company = require('../models/Company');
const Review = require('../models/Review');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create a new company
// @route   POST /api/companies
// @access  Public
const createCompany = asyncHandler(async (req, res) => {
  const { name, logo, description, location, city, foundedOn } = req.body;

  if (!name || !description || !location || !city || !foundedOn) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const company = await Company.create({
    createdBy: req.user._id,
    name,
    logo: logo || undefined,
    description,
    location,
    city,
    foundedOn: new Date(foundedOn),
  });

  res.status(201).json({
    success: true,
    data: company,
  });
});

// @desc    Get all companies with search, filter, sort, pagination
// @route   GET /api/companies
// @access  Public
const getCompanies = asyncHandler(async (req, res) => {
  const {
    search,
    city,
    sort = 'newest',
    page = 1,
    limit = 12,
  } = req.query;

  const query = {};

  // Search by name (case insensitive)
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  // Filter by city
  if (city) {
    query.city = { $regex: city, $options: 'i' };
  }

  // Sort options
  let sortOption = {};
  switch (sort) {
    case 'newest':
      sortOption = { createdAt: -1 };
      break;
    case 'oldest':
      sortOption = { createdAt: 1 };
      break;
    case 'highest-rated':
      sortOption = { averageRating: -1, totalReviews: -1 };
      break;
    case 'most-reviewed':
      sortOption = { totalReviews: -1 };
      break;
    case 'name-az':
      sortOption = { name: 1 };
      break;
    case 'name-za':
      sortOption = { name: -1 };
      break;
    default:
      sortOption = { createdAt: -1 };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const companies = await Company.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Company.countDocuments(query);

  res.json({
    success: true,
    data: companies,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

// @desc    Get single company by ID
// @route   GET /api/companies/:id
// @access  Public
const getCompanyById = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
    res.status(404);
    throw new Error('Company not found');
  }

  res.json({
    success: true,
    data: company,
  });
});

module.exports = {
  createCompany,
  getCompanies,
  getCompanyById,
};
