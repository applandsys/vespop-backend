require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const customerOrderSubmit = async (req, res) => {
    try {
        const { customerId, billingAddress, shippingAddress, orderItems, paymentMethod } = req.body;

        // Create Billing Address
          const billing = await prisma.address.create({ data: billingAddress });
      //  const billing = await prisma.address.create({ data:  addressDemo });

        // Create Shipping Address if provided
        let shipping = null;
        if (shippingAddress) {
            shipping = await prisma.address.create({ data: shippingAddress });
          //  shipping = await prisma.address.create({ data: addressDemo });
        }

        let totalAmount = 0;
        let totalPoint = 0;
        let orderItemsToInsert = [];

        // Process each order item
        if (orderItems.length > 0) {
            for (let orderItem of orderItems) {
                if (Array.isArray(orderItem.attributeValuesIds) && orderItem.attributeValuesIds.length > 0) {
                    // filter out invalid IDs
                    const validAttributeIds = orderItem.attributeValuesIds.filter(id => id && !isNaN(id));

                    for (let attributeValuesId of validAttributeIds) {
                        const variant = await prisma.attributeValue.findUnique({
                            where: { id: parseInt(attributeValuesId) },
                            include: { variantAttributes: true }
                        });

                        if (!variant) {
                            throw new Error(`Variant not found for attributeValueId ${attributeValuesId}`);
                        }

                        if (Array.isArray(variant.variantAttributes) && variant.variantAttributes.length > 0) {
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
                    orderItemsToInsert.push({
                        productId: orderItem.productId,
                        quantity: orderItem.quantity,
                        price: orderItem.price,
                    });
                    totalAmount += orderItem.price * orderItem.quantity;
                    totalPoint += (orderItem.point || 0) * orderItem.quantity;
                }
            }

        }

      //  console.log(orderItemsToInsert);

     //   return;

        // Create Order
        const order = await prisma.order.create({
            data: {
                customerId: parseInt(customerId),
                billingAddressId: billing.id,
                shippingAddressId: shipping ? shipping.id : billing.id,
                totalAmount: parseFloat(totalAmount),
                totalPoint: totalPoint,
                status: 'PENDING',
                orderItems: {
                    create: orderItemsToInsert.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                        variantAttributeId: item.variantAttributeId // Ensure correct relation to variant attribute
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
                payment: true
            }
        });

        res.status(201).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Order creation failed', error: error.message });
    }
};


const customerOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const customerId = req.user.id; // from auth middleware

        const order = await prisma.order.findFirst({
            where: {
                id: parseInt(id),
                customerId: customerId, // 🔐 ownership check
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