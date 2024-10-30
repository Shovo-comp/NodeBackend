// workerRoutes.js
const express = require("express");
const workerController = require("../controllers/workerController"); // Ensure the path is correct
const { authMiddleware } = require("../middlewares/authMiddleware");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// Use express-fileupload middleware

// Define your routes with correct handler functions
router.get('/jobs', authMiddleware, workerController.getJobs);
router.get('/profile', authMiddleware, workerController.viewProfile);
router.put('/profile', authMiddleware, upload.single('profilePicture'), workerController.updateProfile);

module.exports = router;


