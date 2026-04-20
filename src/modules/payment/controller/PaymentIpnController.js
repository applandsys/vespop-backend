const prisma = require("../prisma");
const PaymentFactory = require("../payments/PaymentFactory");

exports.sslIpn = async (req, res) => {
    try {
        const payload = req.body;

        // Save webhook log (audit)
        await prisma.paymentWebhookLog.create({
            data: {
                provider: "SSLCOMMERZ",
                payload
            }
        });

        const { tran_id, val_id, status } = payload;

        if (!tran_id || !val_id) {
            return res.status(400).send("Invalid IPN");
        }

        // Find transaction
        const transaction = await prisma.paymentTransaction.findFirst({
            where: { transactionId: tran_id },
            include: { payment: true }
        });

        // Idempotency check
        if (!transaction || transaction.status === "VALIDATED") {
            return res.status(200).send("Already processed");
        }

        // Verify with SSLCommerz
        const provider = PaymentFactory.create("sslcommerz");
        const isValid = await provider.verifyPayment({ val_id });

        if (!isValid) {
            await prisma.paymentTransaction.update({
                where: { id: transaction.id },
                data: { status: "FAILED" }
            });

            await prisma.payment.update({
                where: { id: transaction.paymentId },
                data: { status: "FAILED" }
            });

            return res.status(200).send("Invalid payment");
        }

        // Mark transaction VALIDATED
        await prisma.paymentTransaction.update({
            where: { id: transaction.id },
            data: {
                status: "VALIDATED",
                valId: val_id,
                rawResponse: payload
            }
        });

        // Mark payment PAID
        await prisma.payment.update({
            where: { id: transaction.paymentId },
            data: { status: "PAID" }
        });

        // TODO: Update order status here

        return res.status(200).send("IPN processed");
    } catch (err) {
        console.error("SSL IPN ERROR:", err);
        return res.status(500).send("Server error");
    }

};

exports.bkashIpn = async (req, res) => {
    try {
        const { paymentID, trxID, status } = req.body;

        await prisma.paymentWebhookLog.create({
            data: {
                provider: "BKASH",
                payload: req.body
            }
        });

        const transaction = await prisma.paymentTransaction.findFirst({
            where: { transactionId: paymentID },
            include: { payment: true }
        });

        if (!transaction || transaction.status === "VALIDATED") {
            return res.send("Already processed");
        }

        if (status !== "Completed") {
            await prisma.paymentTransaction.update({
                where: { id: transaction.id },
                data: { status: "FAILED" }
            });

            return res.send("Failed");
        }

        await prisma.paymentTransaction.update({
            where: { id: transaction.id },
            data: {
                status: "VALIDATED",
                bankTranId: trxID,
                rawResponse: req.body
            }
        });

        await prisma.payment.update({
            where: { id: transaction.paymentId },
            data: { status: "PAID" }
        });

        res.send("bKash payment confirmed");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
};

exports.nagadIpn = async (req, res) => {
    try {
        const { paymentRefId, status } = req.body;

        await prisma.paymentWebhookLog.create({
            data: {
                provider: "NAGAD",
                payload: req.body
            }
        });

        const transaction = await prisma.paymentTransaction.findFirst({
            where: { transactionId: paymentRefId },
            include: { payment: true }
        });

        if (!transaction || transaction.status === "VALIDATED") {
            return res.send("Already processed");
        }

        if (status !== "Success") {
            await prisma.paymentTransaction.update({
                where: { id: transaction.id },
                data: { status: "FAILED" }
            });
            return res.send("Failed");
        }

        await prisma.paymentTransaction.update({
            where: { id: transaction.id },
            data: {
                status: "VALIDATED",
                rawResponse: req.body
            }
        });

        await prisma.payment.update({
            where: { id: transaction.paymentId },
            data: { status: "PAID" }
        });

        res.send("Nagad payment confirmed");
    } catch (err) {
        res.status(500).send("Error");
    }
};