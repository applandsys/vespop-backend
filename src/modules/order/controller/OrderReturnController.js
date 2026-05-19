const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * CREATE ORDER RETURN
 */
const createOrderReturn = async (req, res) => {
    try {
        const {
            orderId,
            orderItemId,
            items, // array of return items
        } = req.body;

        /**
         * Calculate totals
         */
        const totalQuantity = items.reduce(
            (sum, item) => sum + item.quantity,
            0
        );

        const totalAmount = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const orderReturn = await prisma.orderReturn.create({
            data: {
                orderId,
                orderItemId,
                totalQuantity,
                totalAmount,
                orderReturnItems: {
                    create: items.map((item) => ({
                        productId: item.productId,
                        variantAttributeId: item.variantAttributeId || null,
                        price: item.price,
                        quantity: item.quantity,
                    })),
                },
            },
            include: {
                orderReturnItems: {
                    include: {
                        product: true,
                        variantAttribute: {
                            include: {
                                attributeValue: true,
                                productVariant: true,
                            },
                        },
                    },
                },
            },
        });

        res.status(201).json({
            success: true,
            data: orderReturn,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create order return",
        });
    }
};

/**
 * GET ALL ORDER RETURNS
 */
const getOrderReturns = async (req, res) => {
    try {
        const returns = await prisma.orderReturn.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                order: true,
                orderReturnItems: {
                    include: {
                        product: true,
                        variantAttribute: {
                            include: {
                                attributeValue: true,
                            },
                        },
                    },
                },
            },
        });

        res.json({
            success: true,
            data: returns,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch order returns",
        });
    }
};

/**
 * GET SINGLE ORDER RETURN
 */
const getOrderReturnById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const orderReturn = await prisma.orderReturn.findUnique({
            where: { id },
            include: {
                order: true,
                orderReturnItems: {
                    include: {
                        product: true,
                        variantAttribute: {
                            include: {
                                attributeValue: true,
                                productVariant: true,
                            },
                        },
                    },
                },
            },
        });

        if (!orderReturn) {
            return res.status(404).json({
                success: false,
                message: "Order return not found",
            });
        }

        res.json({
            success: true,
            data: orderReturn,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch order return",
        });
    }
};

module.exports ={
    createOrderReturn,
    getOrderReturns,
    getOrderReturnById
}