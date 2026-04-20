const axios = require("axios");
const CourierProvider = require("../CourierProvider");
const { getPathaoToken } = require("../pathaoService");
const { pathaoConfig } = require("@/config/pathao");

class PathaoProvider extends CourierProvider {

    async createOrder(data) {
        const token = await getPathaoToken();

        const res = await axios.post(
            `${pathaoConfig.baseURL}/aladdin/api/v1/orders`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return {
            consignmentId: res.data.data.consignment_id,
            price: res.data.data.delivery_fee,
            raw: res.data,
        };
    }

    async cancelOrder(consignmentId, reason) {
        const token = await getPathaoToken();

        const res = await axios.post(
            `${pathaoConfig.baseURL}/aladdin/api/v1/orders/${consignmentId}/cancel`,
            { reason },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        return res.data;
    }

    async trackOrder(consignmentId) {
        const token = await getPathaoToken();

        const res = await axios.get(
            `${pathaoConfig.baseURL}/aladdin/api/v1/orders/${consignmentId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        return res.data;
    }
}

module.exports = PathaoProvider;