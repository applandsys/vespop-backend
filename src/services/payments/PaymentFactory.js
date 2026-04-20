const BkashProvider = require("./providers/BkashProvider");
const NagadProvider = require("./providers/NagadProvider");
const SslCommerzProvider = require("./providers/SslCommerzProvider");

class PaymentFactory {
    static create(provider) {
        switch (provider) {
            case "bkash":
                return new BkashProvider();
            case "nagad":
                return new NagadProvider();
            case "sslcommerz":
                return new SslCommerzProvider();
            default:
                throw new Error("Invalid payment provider");
        }
    }
}

module.exports = PaymentFactory;