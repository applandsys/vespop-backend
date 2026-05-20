const { allUserOrder} = require("../model/orderUserModel");

const getAllOrderByUser =  async (req,res) => {
    const {id} = req.user;
    const orders = await allUserOrder(id);
    res.json(orders);
}

module.exports = {
    getAllOrderByUser
};
