const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const allUserOrder = async (customerId) => {
    try {
        return await prisma.order.findMany({
            where: {
                customerId,
            },
            select: {
                id: true,          // keep order [bannerId] (or any other fields you need)
                createdAt: true,   // optional
                totalAmount: true,   // optional
                status: true,   // optional
                _count: {
                    select: { orderItems: true },
                },
            },
        });
    } catch (error) {
        console.error("Error fetching user order:", error);
        throw error;
    }
};


module.exports = {
    allUserOrder
}
