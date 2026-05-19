// src/modules/order/OrderService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { createTransaction } = require("../account/AccountService");
const { ACCOUNT_SALES } = require("@/constants/account.constants");

const markOrderPaid = async (orderId, userId = null) => {
    return prisma.$transaction(async (tx) => {

        const order = await tx.order.update({
            where: { id: orderId },
            data: { status: "PAID" },
        });

        await createTransaction({
            particular: `Order #${order.id} Sale`,
            amount: order.totalAmount,
            accountId: ACCOUNT_SALES,
            type: "credit",
            source: "order",
            sourceId: order.id,
            createdBy: userId,
        });

        return order;
    });
};

module.exports = { markOrderPaid };