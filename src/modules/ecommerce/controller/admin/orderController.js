const {getOrderList, changeStatusPaid, pointDistributor, affiliateCommission, orderDetail} = require("../../model/orderModel");
const {createOrder} = require("@/services/courier/pathaoService");
const { PrismaClient } = require("@prisma/client");
const {getOrderListWithCount} = require("@/modules/ecommerce/model/orderModel");
const prisma = new PrismaClient();

const orderList = async (req, res) => {
    const type = req.params.type || null;
    try{
        const orders = await getOrderList(type);
        res.status(201).json({
            message: 'Order List successfully',
            data: orders,
        });
    }catch(err){
        res.status(500).json({ error: 'Server error' });
    }
}

const latestOrder = async (req, res) => {
    const type = req.params.type || null;
    try{
        const orders = await getOrderListWithCount(type);
        res.status(201).json({
            message: 'Order List successfully',
            data: orders,
        });
    }catch(err){
        res.status(500).json({ error: 'Server error' });
    }
}

const makeOrderPaid = async (req,res) => {
   const {orderId} = req.body;
    try{
        const  { order, totalPoint, totalPointFloat } = await orderDetail(orderId);
            await changeStatusPaid(orderId);
            await pointDistributor(orderId);
            await affiliateCommission(orderId);
        res.status(201).json({
            message: 'Order Paid successfully',
            data: {
                order,
                totalPoint,
                totalPointFloat
            }
        });
    }catch(err){
        console.log(err);
        res.status(500).json({ error: err });
    }
}

const changeOrderStatus = async (req,res) => {
    const {orderId, status} = req.body;
    try{
        const  { order, totalPoint, totalPointFloat } = await orderDetail(orderId);
        await changeStatusPaid(orderId);
        await pointDistributor(orderId);
        await affiliateCommission(orderId);
        res.status(201).json({
            message: 'Order Paid successfully',
            data: {
                order,
                totalPoint,
                totalPointFloat
            }
        });
    }catch(err){
        console.log(err);
        res.status(500).json({ error: err });
    }
}

const makeCourierParcel = async (req, res) => {
    try {
        const { orderId } = req.body;
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "orderId is required",
            });
        }
        // 1️⃣ Get order details from DB
        const { order } = await orderDetail(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }
        // 2️⃣ Prepare Pathao payload
        const pathaoPayload = {
            store_id: process.env.PATHAO_STORE_ID,
            merchant_order_id: order.order_code || `ORD-${order.id}`,
            recipient_name: order.customer_name,
            recipient_phone: order.customer_phone,
            recipient_address: order.shipping_address,
            city_id: order.city_id,
            zone_id: order.zone_id,
            area_id: order.area_id,
            delivery_type: 48,
            item_type: 2,
            item_quantity: order.total_quantity || 1,
            item_weight: order.total_weight || 0.5,
            item_description: `Order #${order.order_code}`,
            amount_to_collect: order.payment_method === "COD"
                ? order.grand_total
                : 0,
            special_instruction: order.note || "",
        };
        // 3️⃣ Create Pathao order (token handled internally)
        const pathaoResponse = await createOrder(pathaoPayload);
        // 4️⃣ Save courier info (IMPORTANT)
        await prisma.courierOrder.create({
            data: {
                orderId: order.id,
                courier: "PATHAO",
                consignmentId: pathaoResponse.data.consignment_id,
                status: "created",
                price: pathaoResponse.data.delivery_fee,
                rawResponse: pathaoResponse,
            },
        });
        // 5️⃣ Respond
        res.status(201).json({
            success: true,
            message: "Courier parcel created successfully",
            data: {
                consignment_id: pathaoResponse.data.consignment_id,
                delivery_fee: pathaoResponse.data.delivery_fee,
            },
        });
    } catch (error) {
        console.error("Pathao Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create courier parcel",
            error: error.error || error.message,
        });
    }
};

module.exports = {
    orderList,
    latestOrder,
    makeOrderPaid,
    changeOrderStatus,
    makeCourierParcel
};
