const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// CREATE
exports.createDeal = async (req, res) => {
    try {
        const deal = await prisma.deal.create({
            data: req.body
        });
        res.json(deal);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// GET ACTIVE DEALS
exports.getActiveDeals = async (req, res) => {
    const deals = await prisma.deal.findMany({
        where: {
            isActive: true,
            startDate: { lte: new Date() },
            endDate: { gte: new Date() }
        },
        orderBy: { priority: 'desc' }
    });

    res.json(deals);
};