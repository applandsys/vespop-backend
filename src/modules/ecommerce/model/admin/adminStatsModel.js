const { PrismaClient, OrderStatus } = require('@prisma/client');
const prisma = new PrismaClient();

const getTotalCustomer = async () => {
    try {
       return await prisma.customer.count({
            where: {
                role: 'user',
            },
        });

    } catch (e) {
        console.error(e);  // Log the error for debugging
        throw e;  // Re-throw the error to be handled by calling code
    } finally {
        await prisma.$disconnect(); // Ensure Prisma client is properly disconnected after the operation
    }
};

const getTotalOrder = async () => {
    try {
        return await prisma.order.count({
            where: {
                status: 'PAID',
            },
        });

    } catch (e) {
        console.error(e);  // Log the error for debugging
        throw e;  // Re-throw the error to be handled by calling code
    } finally {
        await prisma.$disconnect(); // Ensure Prisma client is properly disconnected after the operation
    }
};

const getTotalOrderAmount = async () => {
    try {
       const {_sum} = await prisma.order.aggregate({
            _sum: {
                totalAmount: true,
            },
        });
        return  _sum.totalAmount ?? 0;
    } catch (e) {
        console.error(e);  // Log the error for debugging
        throw e;  // Re-throw the error to be handled by calling code
    } finally {
        await prisma.$disconnect(); // Ensure Prisma client is properly disconnected after the operation
    }
}

const getTodayCustomer = async () => {
    try {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const result = await prisma.order.groupBy({
            by: ['customerId'],
            where: {
                createdAt: {
                    gte: startOfToday,
                    lte: endOfToday,
                },
            },
        });

        const totalCustomersOrderedToday = result.length;
        return  totalCustomersOrderedToday ?? 0;
    } catch (e) {
        console.error(e);  // Log the error for debugging
        throw e;  // Re-throw the error to be handled by calling code
    } finally {
        await prisma.$disconnect(); // Ensure Prisma client is properly disconnected after the operation
    }
}

const getTodayOrderAmount = async () => {
    try {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const { _sum } = await prisma.order.aggregate({
            where: {
                createdAt: {
                    gte: startOfToday,
                    lte: endOfToday,
                },
            },
            _sum: {
                totalAmount: true,
            },
        });

        return _sum.totalAmount ?? 0;
    } catch (e) {
        console.error('getTodayOrderAmount error:', e);
        throw e;
    }
};

const getTodayOrderTotal = async () => {
    try {

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);


        return await prisma.order.count({
            where: {
                createdAt: {
                    gte: startOfToday,
                    lte: endOfToday,
                }
            },
        });

    } catch (e) {
        console.error(e);  // Log the error for debugging
        throw e;  // Re-throw the error to be handled by calling code
    } finally {
        await prisma.$disconnect(); // Ensure Prisma client is properly disconnected after the operation
    }
};


module.exports = {
    getTotalCustomer,
    getTotalOrder,
    getTotalOrderAmount,
    getTodayCustomer,
    getTodayOrderAmount,
    getTodayOrderTotal
};
