const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const shippingCostList = async () => {
    return prisma.shippingCostSetting.findMany({
        orderBy: { id: 'desc' }
    });
};

const shippingCostById = async (id) => {
    return prisma.shippingCostSetting.findUnique({
        where: { id: Number(id) }
    });
};

const insertShippingCost = async (data) => {
    return prisma.shippingCostSetting.create({
        data
    });
};

const updateShippingCost = async (id, data) => {
    return prisma.shippingCostSetting.update({
        where: { id: Number(id) },
        data
    });
};

module.exports = {
    shippingCostList,
    shippingCostById,
    insertShippingCost,
    updateShippingCost
};