const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllCustomer = async () => {
    const allCustomer = await prisma.customer.findMany();
    return allCustomer || false;
}

const getAllCustomerFiltered = async () => {
    const allCustomer = await prisma.customer.findMany({
        select: {
            id: true,
            uid: true,
            sponsor_id: true,
            left_child_id: true,
            right_child_id: true,
        }
    });
    return allCustomer || false;
}

module.exports = {
    getAllCustomer,
    getAllCustomerFiltered
}