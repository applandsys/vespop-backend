const PaymentFactory = require("../../../services/payments/PaymentFactory");
const { v4: uuidv4 } = require("uuid");

exports.createPayment = async (req, res) => {
    try {
        const provider = PaymentFactory.create("sslcommerz");

        const payment = await provider.createPayment({
            amount: 1500,
            transactionId: uuidv4(),
            baseUrl: process.env.APP_URL,
            customer: {
                name: req.user.name,
                email: req.user.email,
                phone: req.user.phone,
                address: req.user.address
            }
        });

        res.json({
            redirectUrl: payment.gatewayUrl
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.sslSuccess = async (req, res) => {
    const provider = PaymentFactory.create("sslcommerz");
    const isValid = await provider.verifyPayment(req.body);

    if (isValid) {
        // update order status = PAID
        return res.redirect("/payment-success");
    }

    res.redirect("/payment-failed");
};