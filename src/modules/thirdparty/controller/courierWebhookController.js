const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const mapCourierStatus = require("@/services/courier/statusMapper");

const courierWebhook = async (req, res) => {
    try {
        const payload = req.body;

        /**
         * Normalize incoming payload
         * You may need small tweaks per courier
         */
        const courier = payload.courier; // PATHAO | REDX | STEADFAST
        const consignmentId = payload.consignment_id;
        const externalStatus = payload.status;

        const courierOrder = await prisma.courierOrder.findFirst({
            where: { consignmentId, courier },
        });

        if (!courierOrder) {
            return res.status(404).json({ success: false });
        }

        const normalizedStatus = mapCourierStatus(courier, externalStatus);

        // Update courier order
        await prisma.courierOrder.update({
            where: { id: courierOrder.id },
            data: {
                status: normalizedStatus,
                lastEvent: externalStatus,
                rawResponse: payload,
            },
        });

        // Sync main order
        if (normalizedStatus === "delivered") {
            await prisma.order.update({
                where: { id: courierOrder.orderId },
                data: { status: "delivered" },
            });
        }

        if (normalizedStatus === "cancelled") {
            await prisma.order.update({
                where: { id: courierOrder.orderId },
                data: { status: "cancelled" },
            });
        }

        /*

        await prisma.shipment.update({
              where: { consignmentId },
              data: { status, updatedAt: new Date() },
            });

            await prisma.courierStatusLog.create({
              data: { consignmentId, status, rawPayload: req.body }
            });
         */

        res.json({ success: true });
    } catch (err) {
        console.error("Webhook Error:", err);
        res.status(500).json({ success: false });
    }
};

module.exports = { courierWebhook };