const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const multer = require('multer');
const supabase = require('../config/supabaseConfig');

const { uploadImage } = require('../config/supabaseConfig');

//configure multer for file/image upload
const storage = multer.memoryStorage();
const upload = multer({ storage: multer.memoryStorage() }); // Memory storage for temporary files

console.log('Supabase:', supabase); // Check if supabase is defined




//create a new Job

const createJob = async (req, res) => {
    const { title, description, categoryId } = req.body;
    const files = req.files || [];

    try {
        // Upload images if files are provided
        const imageUrls = await Promise.all(
            (files || []).map(async (file) => {
                return await uploadImage(file);
            })
        );

        // Create job with data, including image URLs if available
        const job = await prisma.job.create({
            data: {
                title,
                description,
                categoryId: parseInt(categoryId),
                images: {
                    create: imageUrls.map((url) => ({ url })),
                },
            },
        });

        res.status(201).json(job);
    } catch (error) {
        console.error("Error creating job:", error.message);
        res.status(500).json({ error: "Could not create job" });
    }
};




// Get all Jobs with categories & Images

const getJobs = async(req, res) => {
    try {
        const jobs = await prisma.job.findMany({
            include: {
                category: true,
                images: true,
            },
        });
        res.status(200).json(jobs);
    } catch (error) {
        console.error('Error fetching jobs: ', error.message)
        res.status(500).json({ error: 'Could not fetch jobs' })
    }
}

// Get Jobs by category

const getJobsByCategory = async(req, res) => {
    const { categoryId } = req.params;
    try {
        const jobs = await prisma.job.findMany({
            where: {
                categoryId: parseInt(categoryId),
            },
            include: {
                // category: true,
                images: true,
            },
        });
        res.status(200).json(jobs);
    } catch (error) {
        console.error('Error fetching jobs by category: ', error.message)
        res.status(500).json({ error: 'Could not fetch jobs' })
    }
}


module.exports = {
    createJob,
    getJobs,
    getJobsByCategory
}