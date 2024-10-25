const { PrismaClient } = require('@prisma/client');
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

        res.status(200).json({ message: 'Admin created successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error creating admin', error });
    }
};

module.exports = { createAdmin };