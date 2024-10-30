const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP, userSetupPassword, userLogin, registerWorker, verifyWorkerOtp, setupPassword, loginWorker } = require('../controllers/authController');

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/user-setup-password', userSetupPassword);
router.post('/login-user', userLogin);

router.post('/register-worker', registerWorker);
router.post('/verify-worker-otp', verifyWorkerOtp);
router.post('/setup-password', setupPassword);
router.post('/login-worker', loginWorker)

module.exports = router;
