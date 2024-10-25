// src/controllers/categoryController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new category
const createCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    const category = await prisma.category.create({
      data: {
        name,
        description,
      },
    });

    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Error creating category' });
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

module.exports = { createCategory, getCategories };
