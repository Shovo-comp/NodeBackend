const express = require('express');
const { verifyToken, isSuperAdmin } = require('../middlewares/authMiddleware');
const { createAdmin } = require('../controllers/adminController');

const router = express.Router();

router.post('/create-admin', verifyToken, isSuperAdmin, createAdmin);

module.exports = router;
