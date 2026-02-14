const {getUserOrderStats} = require("../../model/user/orderStatsModel");

const userOrderStats =  async (req,res) => {
    const {id} = req.params;
    const orderStats = await getUserOrderStats(id);
    res.json(orderStats);
}

module.exports = {
    userOrderStats
};
