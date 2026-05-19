const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * PROFIT CALCULATION (ACCOUNTING BASED)
 */
const calculateProfit = async () => {

    // Total Income
    const income = await prisma.accountTransaction.aggregate({
        _sum: { amount: true },
        where: {
            chartofAccount: {
                type: "INCOME",
            },
            status: "approved",
        },
    });

    // Total Expense
    const expense = await prisma.accountTransaction.aggregate({
        _sum: { amount: true },
        where: {
            chartofAccount: {
                type: "EXPENSE",
            },
            status: "approved",
        },
    });

    const totalIncome = income._sum.amount || 0;
    const totalExpense = expense._sum.amount || 0;

    return {
        totalIncome,
        totalExpense,
        profit: totalIncome - totalExpense,
    };
};

/**
 * ADD TRANSACTION (GENERIC)
 */
const insertTransaction = async (data) => {
    return prisma.accountTransaction.create({
        data: {
            particular: data.particular,
            amount: data.amount,
            accountId: data.accountId,
            type: data.type,
            source: data.source,
            note: data.note,
            status: "approved",
            createdBy: data.createdBy,
        },
    });
};

/**
 * FETCH TRANSACTIONS
 */
const fetchTransactions = async () => {
    return prisma.accountTransaction.findMany({
        include: {
            chartofAccount: true,
        },
        orderBy: { createdAt: "desc" },
    });
};

module.exports = {
    calculateProfit,
    insertTransaction,
    fetchTransactions,
};