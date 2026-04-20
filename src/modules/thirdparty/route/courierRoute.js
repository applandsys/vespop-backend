const express = require('express');
const authenticateToken = require("@/middleware/authenticateToken");
const courierController = require("@/modules/thirdparty/controller/CourierController");
const {courierWebhook} = require("@/modules/thirdparty/controller/courierWebhookController");
const router = express.Router();

router.get('/',  courierController.getCourierList);
router.get('/active',  courierController.getActiveCourierList);
router.get('/:id',  courierController.getCourierById);
router.post('/',  courierController.addCourier);
router.put('/update/:id',  courierController.updateCourier);

router.post("/courier/webhook", courierWebhook);


router.get("/analytics/summary", courierController.getAnalytics);

// router.get("/analytics/status", async (req, res) => {
//     const data = await prisma.shipment.groupBy({
//         by: ["status"],
//         _count: { _all: true },
//     });
//
//     res.json(data);
// });


// router.get("/analytics/monthly", async (req, res) => {
//     const data = await prisma.$queryRaw`
//     SELECT
//       DATE_TRUNC('month', "createdAt") as month,
//       COUNT(*) as total,
//       SUM(price) as revenue
//     FROM "Shipment"
//     GROUP BY month
//     ORDER BY month ASC
//   `;
//     res.json(data);
// });

// router.get("/analytics/failure-rate", async (req, res) => {
//     const data = await prisma.$queryRaw`
//     SELECT
//       "courierName",
//       COUNT(*) FILTER (WHERE status = 'DELIVERED') as delivered,
//       COUNT(*) FILTER (WHERE status != 'DELIVERED') as failed
//     FROM "Shipment"
//     GROUP BY "courierName"
//   `;
//     res.json(data);
// });

module.exports = router;