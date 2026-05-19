// src/modules/purchase/PurchaseService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { createTransaction } = require("../account/AccountService");
const { ACCOUNT_PURCHASE } = require("@/constants/account.constants");

const createPurchaseTransaction = async (data, userId = null) => {
    return prisma.$transaction(async (tx) => {

        const purchase = await tx.purchase.create({
            data,
        });

        const totalCost = purchase.buyPrice * purchase.quantity;

        await createTransaction({
            particular: `Purchase #${purchase.id}`,
            amount: totalCost,
            accountId: ACCOUNT_PURCHASE,
            type: "debit",
            source: "purchase",
            sourceId: purchase.id,
            createdBy: userId,
        });

        return purchase;
    });
};

module.exports = { createPurchaseTransaction };