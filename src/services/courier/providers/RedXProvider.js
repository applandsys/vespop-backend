// services/courier/providers/RedXProvider.js
const axios = require("axios");
const CourierProvider = require("../CourierProvider");
const { redxConfig } = require("@/config/redx");

class RedXProvider extends CourierProvider {

    get headers() {
        return {
            "API-ACCESS-TOKEN": redxConfig.api_key,
            "Content-Type": "application/json",
        };
    }

    /**
     * CREATE ORDER
     */
    async createOrder(data) {
        try {
            const response = await axios.post(
                `${redxConfig.baseURL}/parcel`,
                {
                    invoice: data.merchant_order_id,
                    recipient_name: data.recipient_name,
                    recipient_phone: data.recipient_phone,
                    recipient_address: data.recipient_address,
                    cash_collection_amount: data.amount_to_collect,
                    parcel_weight: data.item_weight || 0.5,
                    instruction: data.special_instruction || "",
                },
                { headers: this.headers }
            );

            return {
                consignmentId: response.data.tracking_id,
                price: response.data.delivery_charge,
                raw: response.data,
            };

        } catch (error) {
            throw {
                message: "RedX create order failed",
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
                `${redxConfig.baseURL}/parcel/cancel`,
                {
                    tracking_id: consignmentId,
                    reason,
                },
                { headers: this.headers }
            );

            return response.data;
        } catch (error) {
            throw {
                message: "RedX cancel order failed",
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
                `${redxConfig.baseURL}/parcel/track/${consignmentId}`,
                { headers: this.headers }
            );

            return response.data;
        } catch (error) {
            throw {
                message: "RedX tracking failed",
                error: error.response?.data || error.message,
            };
        }
    }
}

module.exports = RedXProvider;