const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getUserOrderStats = async (userId) => {
    try {
        const stats = await prisma.order.groupBy({
            by: ['status'],
            where: {
                customerId: parseInt(userId)
            },
            _count: {
                status: true
            }
        });

        // Convert array to object like { PENDING: 2, SHIPPED: 1, ... }
        const result = stats.reduce((acc, curr) => {
            acc[curr.status] = curr._count.status;
            return acc;
        }, {});

        // Ensure all statuses are present (even if 0)
        const allStatuses = [
            "PENDING",
            "PAID",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED",
            "RETURNED"
        ];

        allStatuses.forEach(status => {
            if (!result[status]) result[status] = 0;
        });

        return result;
    } catch (error) {
        console.error("Error fetching user order stats:", error);
        throw error;
    }
};

module.exports = {
    getUserOrderStats
}
