const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP, registerWorker, verifyWorkerOtp } = require('../controllers/authController');

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

router.post('/register-worker', registerWorker);
router.post('/verify-worker-otp', verifyWorkerOtp);

module.exports = router;
