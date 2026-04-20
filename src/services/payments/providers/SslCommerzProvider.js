const axios = require("axios");
const PaymentProvider = require("../PaymentProvider");

class SslCommerzProvider extends PaymentProvider {
    constructor() {
        super();

        this.storeId = process.env.SSLCOMMERZ_STORE_ID;
        this.storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;
        this.isLive = process.env.SSLCOMMERZ_IS_LIVE === "true";

        this.baseUrl = this.isLive
            ? "https://securepay.sslcommerz.com"
            : "https://sandbox.sslcommerz.com";
    }

    /**
     * Create Payment Session
     */
    async createPayment(data) {
        const payload = {
            store_id: this.storeId,
            store_passwd: this.storePassword,
            total_amount: data.amount,
            currency: "BDT",
            tran_id: data.transactionId, // unique per order
            success_url: process.env.SSLCOMMERZ_SUCCESS_URL,
            fail_url: process.env.SSLCOMMERZ_FAIL_URL,
            cancel_url: process.env.SSLCOMMERZ_CANCEL_URL,
            ipn_url: `${data.baseUrl}/api/payment/ssl/ipn`,

            shipping_method: "Courier",
            product_name: "Ecommerce Order",
            product_category: "General",
            product_profile: "general",

            cus_name: data.customer.name,
            cus_email: data.customer.email,
            cus_add1: data.customer.address,
            cus_city: data.customer.city || "Dhaka",
            cus_postcode: data.customer.postcode || "1207",
            cus_country: "Bangladesh",
            cus_phone: data.customer.phone,

            ship_name: data.customer.name,
            ship_add1: data.customer.address,
            ship_city: data.customer.city || "Dhaka",
            ship_country: "Bangladesh"
        };

        const response = await axios.post(
            `${this.baseUrl}/gwprocess/v4/api.php`,
            payload,
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        if (response.data.status !== "SUCCESS") {
            throw new Error("SSLCommerz session failed");
        }

        return {
            provider: "sslcommerz",
            sessionKey: response.data.sessionkey,
            gatewayUrl: response.data.GatewayPageURL,
            transactionId: data.transactionId,
            raw: response.data
        };
    }

    /**
     * Verify Payment (after success / IPN)
     */
    async verifyPayment(data) {
        const payload = {
            store_id: this.storeId,
            store_passwd: this.storePassword,
            val_id: data.val_id
        };

        const response = await axios.get(
            `${this.baseUrl}/validator/api/validationserverAPI.php`,
            { params: payload }
        );

        return response.data.status === "VALID";
    }

    /**
     * Refund (Optional – if enabled by SSL)
     */
    async refund(data) {
        const payload = {
            store_id: this.storeId,
            store_passwd: this.storePassword,
            refund_amount: data.amount,
            refund_remarks: "Order refund",
            bank_tran_id: data.bankTranId,
            refe_id: data.refundRef
        };

        const response = await axios.post(
            `${this.baseUrl}/validator/api/merchantTransIDvalidationAPI.php`,
            payload
        );

        return response.data.status === "success";
    }
}

module.exports = SslCommerzProvider;