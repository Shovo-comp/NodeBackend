const { PrismaClient } = require('@prisma/client');
const { uploadImage } = require('../config/supabaseConfig');
const prisma = new PrismaClient();

//Controller to create an admin

const createAdmin = async (req, res) => {
    const { phone } = req.body;

    try{
        let user = await prisma.user.findUnique({
            where: {phone: phone.toString()},
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    phone: phone.toStrig(),
                    role: 'admin',
                },
            });
        } else {
            // user which is already exits
            user = await prisma.user.update({
                where: { phone: phone.toString() },
                data: { role: 'admin' },
            });
        }


        const token = jwt.sign({
            userId: user.id,
            role: user.role,
            phone: user.phone,
        }, process.env.JWT_SECRET, { expiresIn: '1h' })

        res.status(200).json({ message: 'Admin created successfully', user, token });
    } catch (error) {
        res.status(500).json({ message: 'Error creating admin', error });
    }
};



async function addJob(req, res) {
    const { title, description, categoryId } = req.body;
    const images = req.files;

    try {
        // Validate input
        if (!title || !description || !categoryId) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const imageUrl = await Promise.all((
            images || []).map(async (file) => {
                return await uploadImage(file);
            })
        );

        // Create job
        const newJob = await prisma.job.create({
            data: {
                title,
                description,
                categoryId,
                images: {
                    create: imageUrl.map(url => ({ url })) // Assuming images are an array of URLs
                }
            }
        });

        res.status(201).json({ message: "Job added successfully", job: newJob });
    } catch (error) {
        console.error("Error adding job:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}



// Delete Job

async function deleteJob(req, res) {
    const { id } = req.params;
    console.log(id);

    try {
        const jobId = parseInt(id, 10);

        if (isNaN(jobId)) {
            return res.status(400).json({ error: "Invalid job ID" });
        }

        const job = await prisma.job.findUnique({
            where: { id: jobId },
        });

        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }

        await prisma.job.delete( {where: {id: parseInt(jobId)}});
        res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
        console.error("Error deleting job:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

//Get all users 

async function getAllUsers(req, res) {
    try {
        const users = await prisma.User.findMany({
            select: {
                id: true, name: true, email: true, phone: true, role: true, createdAt: true, updatedAt: true, token: true, password: true,
            },
        });

        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


module.exports = { createAdmin, addJob, deleteJob, getAllUsers };