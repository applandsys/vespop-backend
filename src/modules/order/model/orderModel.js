const { PrismaClient , OrderStatus} = require('@prisma/client');
const getTodayDate = require("../../../utils/getTodayDate");
const prisma = new PrismaClient();

const getOrderList = async (type) => {

    let orderList = [];

    if(type!==null){
        orderList = await prisma.order.findMany(
            {
                data: {
                    where: {
                        status: type
                    }
                },
                include: {
                    orderItems: {
                        include: {
                            product: true
                        }
                    },
                    customer: true,
                    shippingAddress: false,
                    billingAddress: true,
                    payment: true,
                },
            }
        );
    }else{
         orderList = await prisma.order.findMany(
            {
                include: {
                    orderItems: {
                        include: {
                            product: true
                        }
                    },
                    customer: true,
                    shippingAddress: false,
                    billingAddress: true,
                    payment: true,
                },
            }
        );
    }

    return orderList || false;
}

const getOrderListWithCount = async (type, limit = 10, offset = 0) => {
    const where = type !== null ? { status: type } : {};

    const [orders, total] = await prisma.$transaction([
        prisma.order.findMany({
            where,
            skip: offset,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                orderItems: { include: { product: true } },
                customer: true,
                billingAddress: true,
                payment: true,
            },
        }),
        prisma.order.count({ where }),
    ]);

    return { orders, total };
};

const changeStatusPaid = async (orderId) => {

    try{
        await prisma.order.update({
            where: {
                id: parseInt(orderId)
            },
            data: {
                status: OrderStatus.PAID,
            }
        })
    }catch (e){
        console.log(e)
    }
}

const orderDetail = async (orderId) => {
    const order = await prisma.order.findFirst({
        where: {
            id: parseInt(orderId)
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            },
            customer: true
        },
    });

    if (!order) {
        throw new Error('Order not found');
    }

    const totalPoint = order.orderItems.reduce((sum, item) => sum + item.product.point, 0);
    const totalPointFloat = parseFloat(totalPoint);

    return {  order , totalPoint, totalPointFloat };
};


const pointDistributor = async (orderId) => {
    try{

        const  { order, totalPoint, totalPointFloat } = await orderDetail(orderId);

        const customerId = order.customerId;

        if(order){
            return await prisma.customerPoint.create({
                data: {
                    customerId: parseInt(customerId),
                    amount: totalPointFloat,
                    orderId: orderId,
                    dateAt: getTodayDate()
                }
            });
        }

    }catch (e){
        console.log(e)
    }

}

const affiliateCommission = async (orderId) => {

    const  { order, totalPoint, totalPointFloat } = await orderDetail(orderId);

    const customerId = order.customerId;

    try{

        const customer = await prisma.customer.findUnique({where: {id: customerId}});

        if (customer && customer.sponsor_id) {
            await prisma.affiliateComission.create({
                data: {
                    customerId: customer.sponsor_id,
                    amount: totalPointFloat * 0.10,
                    orderId: orderId,
                    percentage: 10,
                    orderAmount: totalPoint
                }
            })
        }
    }catch (e){
        console.log(e)
    }
}

module.exports = {
    orderDetail,
    getOrderList,
    getOrderListWithCount,
    changeStatusPaid,
    pointDistributor,
    affiliateCommission
}