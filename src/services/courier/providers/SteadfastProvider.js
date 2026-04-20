// services/courier/providers/SteadfastProvider.js
const axios = require("axios");
const CourierProvider = require("../CourierProvider");
const { steadfastConfig } = require("@/config/steadfast");

class SteadfastProvider extends CourierProvider {

    get headers() {
        return {
            "Api-Key": steadfastConfig.api_key,
            "Secret-Key": steadfastConfig.secret_key,
            "Content-Type": "application/json",
        };
    }

    /**
     * CREATE ORDER
     */
    async createOrder(data) {
        try {
            const response = await axios.post(
                `${steadfastConfig.baseURL}/create_order`,
                {
                    invoice: data.merchant_order_id,
                    recipient_name: data.recipient_name,
                    recipient_phone: data.recipient_phone,
                    recipient_address: data.recipient_address,
                    cod_amount: data.amount_to_collect,
                    note: data.special_instruction || "",
                },
                { headers: this.headers }
            );

            return {
                consignmentId: response.data.consignment_id,
                price: response.data.delivery_charge,
                raw: response.data,
            };

        } catch (error) {
            throw {
                message: "Steadfast create order failed",
                error: error.response?.data || error.message,
            };
        }
    }

    /**
     * CANCEL ORDER
     */
    async cancelOrder(consignmentId, reason = "Cancelled by merchant") {
        try {
            const response = await axios.post(
                `${steadfastConfig.baseURL}/cancel_order`,
                {
                    consignment_id: consignmentId,
                    reason,
                },
                { headers: this.headers }
            );

            return response.data;
        } catch (error) {
            throw {
                message: "Steadfast cancel order failed",
                error: error.response?.data || error.message,
            };
        }
    }

    /**
     * TRACK ORDER
     */
    async trackOrder(consignmentId) {
        try {
            const response = await axios.get(
                `${steadfastConfig.baseURL}/status_by_consignment_id/${consignmentId}`,
                { headers: this.headers }
            );

            return response.data;
        } catch (error) {
            throw {
                message: "Steadfast tracking failed",
                error: error.response?.data || error.message,
            };
        }
    }
}

module.exports = SteadfastProvider;