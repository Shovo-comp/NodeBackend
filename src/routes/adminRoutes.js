const express = require('express');
const { verifyToken, isSuperAdmin, authMiddleware } = require('../middlewares/authMiddleware');
const { createAdmin, addJob, deleteJob, getAllUsers } = require('../controllers/adminController');
const {roleMiddleware, authorizeRoles} = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create-admin', verifyToken, isSuperAdmin, createAdmin);

router.post('/add-job', authorizeRoles("admin", "super-admin"), addJob);
router.delete('/delete-job/:jobId', authorizeRoles("admin", "super-admin"), deleteJob);
router.get('/all-users', authorizeRoles("admin", "super-admin"), getAllUsers);


module.exports = router;
