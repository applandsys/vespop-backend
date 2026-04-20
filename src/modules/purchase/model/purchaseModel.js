const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const purchaseList = async () => {
    return prisma.supplier.findMany();
}

const purchaseById = async (id) => {
    return prisma.supplier.findFirst({
        where: {
            id: parseInt(id)
        }
    })
}

const createPurchase = async (data) => {
    return prisma.supplier.create({
        data: data
    });
}

const updatePurchaseById = async (id, data) => {
    return prisma.supplier.update({
        where: { id: Number(id) },
        data,
    });
};

module.exports = {
    purchaseList,
    purchaseById,
    createPurchase,
    updatePurchaseById
}