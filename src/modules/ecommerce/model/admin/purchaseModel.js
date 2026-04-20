const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// models/purchaseModel.js
const getPurchaseModel = async (skip, limit) => {
    const [data, total] = await Promise.all([
        prisma.purchase.findMany({
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                supplier: true,
                product: true,
            },
        }),
        prisma.purchase.count(),
    ]);

    return { data, total };
};

const getPurchaseByIdModel = async (purchaseId) => {
    return prisma.productCategory.findUnique({
        where: {
            id: parseInt(purchaseId)
        },
        include: {
            products: true,
            supplier: true
        },
    });
}

const insertPurchaseModel = async (data) => {
    return prisma.purchase.create({
        data
    });
}

module.exports = {
    insertPurchaseModel,
    getPurchaseModel,
    getPurchaseByIdModel
}
