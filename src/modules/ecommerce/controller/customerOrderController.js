require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const customerOrderSubmit = async (req, res) => {
    try {
        const { customerId, billingAddress, shippingAddress, orderItems, paymentMethod } = req.body;

        const order = await prisma.$transaction(async (tx) => {

            // Create Billing Address
            const billing = await tx.address.create({
                data: billingAddress
            });

            // Create Shipping Address
            let shipping = billing;

            if (shippingAddress) {
                shipping = await tx.address.create({
                    data: shippingAddress
                });
            }

            let totalAmount = 0;
            let totalPoint = 0;
            let orderItemsToInsert = [];

            if (orderItems.length > 0) {
                for (let orderItem of orderItems) {

                    if (Array.isArray(orderItem.attributeValuesIds) && orderItem.attributeValuesIds.length > 0) {

                        const validAttributeIds = orderItem.attributeValuesIds.filter(
                            id => id && !isNaN(id)
                        );

                        for (let attributeValuesId of validAttributeIds) {

                            const variant = await tx.attributeValue.findUnique({
                                where: { id: parseInt(attributeValuesId) },
                                include: { variantAttributes: true }
                            });

                            if (!variant) {
                                throw new Error(`Variant not found for attributeValueId ${attributeValuesId}`);
                            }

                            if (variant.variantAttributes?.length > 0) {

                                for (let variantAttribute of variant.variantAttributes) {

                                    const orderItemEach = {
                                        productId: orderItem.productId,
                                        quantity: orderItem.quantity,
                                        price: orderItem.price,
                                        variantAttributeId: variantAttribute.id
                                    };

                                    orderItemsToInsert.push(orderItemEach);

                                    totalAmount += orderItemEach.price * orderItemEach.quantity;
                                    totalPoint += (orderItemEach.point || 0) * orderItemEach.quantity;
                                }
                            }
                        }

                    } else {

                        const orderItemEach = {
                            productId: orderItem.productId,
                            quantity: orderItem.quantity,
                            price: orderItem.price
                        };

                        orderItemsToInsert.push(orderItemEach);

                        totalAmount += orderItemEach.price * orderItemEach.quantity;
                        totalPoint += (orderItem.point || 0) * orderItemEach.quantity;
                    }
                }
            }

            // Create Order
            const order = await tx.order.create({
                data: {
                    customer: {
                        connect: { id: parseInt(customerId) }
                    },
                    billingAddress: {
                        connect: { id: billing.id }
                    },
                    shippingAddress: {
                        connect: { id: shipping.id }
                    },
                    totalAmount: totalAmount,
                    totalPoint: totalPoint,
                    status: 'PENDING',
                    vendor: {
                        connect: {id: 1}
                    },
                    orderItems: {
                        create: orderItemsToInsert.map(item => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.price,
                            ...(item.variantAttributeId && {
                                variantAttributeId: item.variantAttributeId
                            })
                        }))
                    },

                    payment: {
                        create: {
                            method: paymentMethod,
                            status: 'PENDING'
                        }
                    }
                },
                include: {
                    orderItems: true,
                    payment: true,
                    customer: true
                }
            });

            return order;
        });

        res.status(201).json(order);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Order creation failed",
            error: error.message
        });
    }
};


const customerOrderById = async (req, res) => {
    try {
        const { id } = req.params;
      //  const customerId = req.user.id; // from auth middleware

        const order = await prisma.order.findFirst({
            where: {
                id: parseInt(id)
            },
            include: {
                orderItems: {
                    include: {
                        product : true
                    }
                }, // optional
            },
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({
            success: true,
            data: order,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};



module.exports = {
    customerOrderSubmit,
    customerOrderById
};