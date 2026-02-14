const {getOrderList, changeStatusPaid, pointDistributor, affiliateCommission, orderDetail} = require("../../model/orderModel");

const orderList = async (req, res) => {

    try{
        const orders = await getOrderList();

        res.status(201).json({
            message: 'Order List successfully',
            data: orders,
        });

    }catch(err){
        res.status(500).json({ error: 'Server error' });
    }

}

const makeOrderPaid = async (req,res) => {
   const {orderId} = req.body;
    try{

        const  { order, totalPoint, totalPointFloat } = await orderDetail(orderId);

            await changeStatusPaid(orderId);
            await pointDistributor(orderId);
            await affiliateCommission(orderId);

        res.status(201).json({
            message: 'Order Paid successfully',
            data: {
                order,
                totalPoint,
                totalPointFloat
            }
        });

    }catch(err){
        console.log(err);
        res.status(500).json({ error: err });
    }


}

module.exports = {
    orderList,
    makeOrderPaid
};
