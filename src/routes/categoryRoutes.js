// src/routes/categoryRoutes.js
const express = require('express');
const { createCategory, getCategories } = require('../controllers/categoryController');

const router = express.Router();

// Route to create a category
router.post('/', createCategory);

// Route to get all categories
router.get('/', getCategories);

module.exports = router;
