const PaymentProvider = require("../PaymentProvider");

class BkashProvider extends PaymentProvider {
    async createPayment(data) {
        // Call bKash create payment API
        return {
            provider: "bkash",
            paymentId: "BKASH123",
            amount: data.amount,
            raw: {}
        };
    }

    async executePayment(paymentId) {
        return {
            status: "success",
            transactionId: "BKASH_TRX_456"
        };
    }

    async verifyPayment(data) {
        return true;
    }

    async refund(paymentId, amount) {
        return true;
    }
}

module.exports = BkashProvider;