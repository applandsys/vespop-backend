class CourierProvider {
    createOrder(data) {
        throw new Error("createOrder not implemented");
    }

    cancelOrder(consignmentId, reason) {
        throw new Error("cancelOrder not implemented");
    }

    trackOrder(consignmentId) {
        throw new Error("trackOrder not implemented");
    }
}

module.exports = CourierProvider;