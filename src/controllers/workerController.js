const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); 


const getJobs = async (req, res) => {
    try {
        const jobs = await prisma.job.findMany({
            where: {
                workerId: req.user.id
            },
        });

        res.stauts(200).json({ jobs })
    } catch (error) {
        res.stauts(500).json({ error: error.message })
    }
}

module.exports = {
    getJobs
};