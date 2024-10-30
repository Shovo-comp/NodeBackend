const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const { uploadImage, profileImages } = require('../config/supabaseConfig');

const getJobs = async (req, res) => {
    try {
        const jobs = await prisma.job.findMany({
            where: {
                workerId: req.user.id
            },
        });

        res.status(200).json({ jobs }); // Fixed typo here
    } catch (error) {
        res.status(500).json({ error: error.message }); // Fixed typo here
    }
}

const viewProfile = async (req, res) => {
    try {
        const workerId = req.user.userId;
        console.log('Worker ID from token:', workerId);

        if (!workerId) {
            console.error('Unauthorized access: No worker ID found');
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const worker = await prisma.worker.findUnique({
            where: { id: workerId },
            select: { id: true, name: true, phone: true, email: true, bio: true, skills: true, isAvailable: true, location: true, profilePic: true, otp: true, password: true, token: true }
        });

        if (!worker) {
            return res.status(404).json({ error: 'Worker not found' });
        }

        res.status(200).json({ worker });
    } catch (error) {
        console.error('Error viewing worker profile:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const updateProfile = async (req, res) => {
    try {
        const workerId = req.user.userId;
        const { name, phone, email, bio, skills, isAvailable, location } = req.body;
        let profilePicUrl;

        // Check if a file was uploaded
        if (req.file) {
            profilePicUrl = await profileImages(req.file);
            if (!profilePicUrl) {
                return res.status(500).json({ error: 'Error uploading profile picture' });
            }
        }


        // Prepare the update data
        const updateData = {};
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone.toString();
        if (email) updateData.email = email;
        if (bio) updateData.bio = bio;
        if (skills) updateData.skills = skills.split(',').map(skill => skill.trim());
        if (isAvailable !== undefined) updateData.isAvailable = isAvailable;
        if (location) updateData.location = location;
        if (profilePicUrl) updateData.profilePic = profilePicUrl; // Assuming `profilePic` exists in your Prisma model

        const updatedWorker = await prisma.worker.update({
            where: { id: workerId },
            data: updateData
        });

        res.status(200).json({ updatedWorker });
    } catch (error) {
        console.error('Error updating worker profile:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};




module.exports = {
    getJobs,
    viewProfile,
    updateProfile
}