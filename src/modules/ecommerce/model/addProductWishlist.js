const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const addCustomerWishListCreate = async ( customerId, productId) => {
    try {

        const product = await prisma.product.findUnique({
            where: {
                id: parseInt(productId),
            },
        });

        if (!product) {
            throw new Error(`Product with ID ${productId} not found`);
        }

        const customer = await prisma.customer.findUnique({
            where: {
                id: parseInt(customerId),
            },
        });

        if (!customer) {
            throw new Error(`Customer with ID ${customerId} not found`);
        }

        return await prisma.customerWishList.create({
            data: {
                productId: parseInt(productId),
                customerId: parseInt(customerId),
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
    addCustomerWishListCreate,
};
