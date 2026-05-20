const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// CREATE
exports.createCoupon = async (req, res) => {
    try {
        const coupon = await prisma.coupon.create({
            data: req.body
        });
        res.json(coupon);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// READ
exports.getAllCoupons = async (req, res) => {
    const coupons = await prisma.coupon.findMany();
    res.json(coupons);
};

// APPLY COUPON
exports.applyCoupon = async (req, res) => {
    const { code, cartTotal, userId } = req.body;

    const coupon = await prisma.coupon.findFirst({
        where: {
            code,
            isActive: true,
            startDate: { lte: new Date() },
            endDate: { gte: new Date() }
        }
    });

    if (!coupon) {
        return res.status(404).json({ error: 'Invalid coupon' });
    }

    // usage limit
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        return res.status(400).json({ error: 'Coupon usage limit reached' });
    }

    // per user limit
    if (coupon.perUserLimit) {
        const usedByUser = await prisma.couponUsage.count({
            where: { couponId: coupon.id, userId }
        });

        if (usedByUser >= coupon.perUserLimit) {
            return res.status(400).json({ error: 'Coupon already used by user' });
        }
    }

    if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
        return res.status(400).json({ error: 'Minimum order not met' });
    }

    let discount =
        coupon.discountType === 'PERCENTAGE'
            ? (cartTotal * coupon.discountValue) / 100
            : coupon.discountValue;

    if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
    }

    res.json({
        originalAmount: cartTotal,
        discount,
        finalAmount: cartTotal - discount
    });
};