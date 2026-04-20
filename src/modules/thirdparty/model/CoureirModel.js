const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const courierList = async () => {
    return prisma.courier.findMany();
}

const ActiveCourierList = async () => {
    return prisma.courier.findMany({
        where: {
            isActive: true
        }
    });
}

const courierById = async (id) => {
    return prisma.courier.findFirst({
        where: {
            id: parseInt(id)
        }
    })
}

const createCourier = async (data) => {
    return prisma.courier.create({
        data: data
    });
}

const updateCourierById = async (id, data) => {
    return prisma.courier.update({
        where: { id: Number(id) },
        data,
    });
};

module.exports = {
    courierList,
    ActiveCourierList,
    courierById,
    createCourier,
    updateCourierById
}