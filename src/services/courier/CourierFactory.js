const PathaoProvider = require("./providers/PathaoProvider");
const RedXProvider = require("./providers/RedXProvider");
const SteadfastProvider = require("./providers/SteadfastProvider");

class CourierFactory {
    static getCourier(name) {
        switch (name) {
            case "PATHAO":
                return new PathaoProvider();
            case "REDX":
                return new RedXProvider();
            case "STEADFAST":
                return new SteadfastProvider();
            default:
                throw new Error("Unsupported courier");
        }
    }
}

module.exports = CourierFactory;

/** Use in controller
 const CourierFactory = require("@/services/courier/CourierFactory");
 const prisma = require("@/lib/prisma");
 const { orderDetail } = require("../../model/orderModel");

 const makeCourierParcel = async (req, res) => {
     try {
     const { orderId, courier } = req.body;

     const { order } = await orderDetail(orderId);

     const courierProvider = CourierFactory.getCourier(courier);

     const result = await courierProvider.createOrder({
         recipient_name: order.customer_name,
         recipient_phone: order.customer_phone,
         recipient_address: order.shipping_address,
         amount_to_collect: order.cod_amount,
         item_weight: 0.5,
     });

     await prisma.courierOrder.create({
         data: {
             orderId: order.id,
             courier,
             consignmentId: result.consignmentId,
             status: "created",
             price: result.price,
             rawResponse: result.raw,
         },
     });

     res.json({
         success: true,
         message: "Courier created successfully",
         data: result,
     });

     } catch (err) {
         res.status(500).json({
         success: false,
         message: err.message,
         });
     }
 };

 module.exports = { makeCourierParcel };


 */