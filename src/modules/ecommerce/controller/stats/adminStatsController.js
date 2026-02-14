const {getTotalCustomer, getTotalOrder, getTotalOrderAmount, getTodayCustomer, getTodayOrderAmount, getTodayOrderTotal} = require("@/modules/ecommerce/model/admin/adminStatsModel");

const adminStats = async (req,res) => {

    const totalCustomer = await getTotalCustomer();
    const totalOrder = await  getTotalOrder();
    const totalOrderAmount = await  getTotalOrderAmount();
    const todayCustomer = await  getTodayCustomer();
    const todayOrderAmount = await  getTodayOrderAmount();
    const getTodayOrder = await  getTodayOrderTotal();

    const stats =
        {
            totalCustomer,
            totalOrder,
            totalOrderAmount,
            todayCustomer,
            todayOrderAmount,
            getTodayOrder
        };

    res.json(stats);

}

module.exports = {
    adminStats,
};