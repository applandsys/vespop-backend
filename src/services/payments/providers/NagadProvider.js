const PaymentProvider = require("../PaymentProvider");

class NagadProvider extends PaymentProvider {
    async createPayment(data) {
        return {
            provider: "nagad",
            paymentId: "NAGAD123",
            amount: data.amount,
            raw: {}
        };
    }

    async executePayment(paymentId) {
        return {
            status: "success",
            transactionId: "NAGAD_TRX_789"
        };
    }

    async verifyPayment(data) {
        return true;
    }

    async refund(paymentId, amount) {
        return true;
    }
}

module.exports = NagadProvider;