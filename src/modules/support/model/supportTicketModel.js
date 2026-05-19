const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const insertSupportTicket = async (userId, subject, message, priority) => {
    return prisma.supportTicket.create({
        data: {
            userId,
            subject,
            message,
            priority: priority,  // priority should be a string now
        },
    });
};

const fetchSupportTicket = async (userId) => {
    return prisma.supportTicket.findMany({
        where: {
            userId
        }
    });
}

module.exports = {
    insertSupportTicket,
    fetchSupportTicket
}