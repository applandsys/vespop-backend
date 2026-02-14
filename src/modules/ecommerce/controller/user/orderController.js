const { allUserOrder} = require("../../model/user/orderModel");

const getAllOrderByUser =  async (req,res) => {
    const {id} = req.user;
    const orders = await allUserOrder(id);
    res.json(orders);
}

module.exports = {
    getAllOrderByUser
};
