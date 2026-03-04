const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const courierList = async () => {
    return prisma.courier.findMany();
}

const createCourier = async (data) => {
    return prisma.courier.create({
        data: data
    });
}

module.exports = {
    courierList,
    createCourier
}