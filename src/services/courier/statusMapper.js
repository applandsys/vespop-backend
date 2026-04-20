module.exports = function mapCourierStatus(courier, externalStatus) {
    const status = externalStatus.toLowerCase();

    if (courier === "PATHAO") {
        if (status.includes("picked")) return "picked";
        if (status.includes("transit")) return "in_transit";
        if (status.includes("delivered")) return "delivered";
        if (status.includes("cancel")) return "cancelled";
    }

    if (courier === "REDX") {
        if (status === "pickup_done") return "picked";
        if (status === "on_the_way") return "in_transit";
        if (status === "delivered") return "delivered";
    }

    if (courier === "STEADFAST") {
        if (status === "received") return "picked";
        if (status === "processing") return "in_transit";
        if (status === "completed") return "delivered";
    }

    return "unknown";
};