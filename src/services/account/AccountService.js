// src/modules/account/AccountService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createTransaction = async ({
                                     particular,
                                     amount,
                                     accountId,
                                     type,
                                     source,
                                     sourceId,
                                     createdBy,
                                 }) => {
    return prisma.accountTransaction.create({
        data: {
            particular,
            amount,
            accountId,
            type,
            source,
            note: sourceId ? `ref:${sourceId}` : null,
            status: "approved",
            createdBy,
        },
    });
};

module.exports = { createTransaction };