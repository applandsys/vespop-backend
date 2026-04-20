class PaymentProvider {
    async createPayment(data) {
        throw new Error("createPayment() not implemented");
    }

    async executePayment(paymentId) {
        throw new Error("executePayment() not implemented");
    }

    async verifyPayment(data) {
        throw new Error("verifyPayment() not implemented");
    }

    async refund(paymentId, amount) {
        throw new Error("refund() not implemented");
    }

}

module.exports = PaymentProvider;