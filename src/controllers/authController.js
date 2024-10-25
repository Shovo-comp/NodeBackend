const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const { sendOTP } = require('../config/fast2sms');
const { generateOTP } = require('../utils/generateOTP');

// Send OTP function
exports.sendOTP = async (req, res) => {
    const { phone } = req.body;

    // Validate phone number
    if (!phone) return res.status(400).json({ error: 'Phone number is required' });

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    try {
        // Check if user exists
        let user = await prisma.user.findUnique({ where: { phone: phone.toString() } });

        if (!user) {
            // Create user if not exists
            user = await prisma.user.create({
                data: { phone: phone.toString(), otp, otpExpiry },
            });
        } else {
            // Update OTP and expiry if user exists
            await prisma.user.update({
                where: { phone: phone.toString() },
                data: { otp, otpExpiry },
            });
        }

        // Send OTP using Fast2SMS
        const response = await sendOTP(phone, otp);
        console.log("OTP sent successfully:", JSON.stringify(response));

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error("Error sending OTP:", error.message);
        res.status(500).json({ error: 'Could not send OTP' });
    }
};

exports.verifyOTP = async (req, res) => {
    const { phone, otp } = req.body;

    // Validate incoming data
    if (!phone || !otp) {
        return res.status(400).json({ error: 'Phone and OTP are required' });
    }

    try {
        // Fetch user data from the database
        const user = await prisma.user.findUnique({ where: { phone: phone.toString() } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the OTP and expiry are set
        if (user.otp === null || user.otpExpiry === null) {
            return res.status(400).json({ error: 'OTP not set or expired' });
        }

        // Check OTP and expiry
        const currentTime = new Date(); // Get current time in UTC
        const otpExpiry = new Date(user.otpExpiry); // Convert db expiry to Date object

        console.log(`Current time: ${currentTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
        console.log(`OTP Expiry time: ${otpExpiry.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);

        // Compare OTP values
        if (user.otp.toString().trim() !== otp.toString().trim() || otpExpiry < currentTime) {
            console.log(`Invalid OTP or expired. User OTP: ${user.otp}, Provided OTP: ${otp}, Expiry: ${otpExpiry}, Now: ${currentTime}`);
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        // Generate JWT token after successful OTP verification
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Clear OTP fields after successful verification
        await prisma.user.update({
            where: { phone: phone.toString() },
            data: { otp: null, otpExpiry: null },
        });

        res.status(200).json({ token, message: 'OTP verified successfully' });
    } catch (error) {
        console.error("Error verifying OTP:", error.message);
        res.status(500).json({ error: 'OTP verification failed' });
    }
};

