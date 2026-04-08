const {getOrderList, changeStatusPaid, pointDistributor, affiliateCommission, orderDetail} = require("../../model/orderModel");
const {getPathaoToken, createOrder, createStore} = require("@/services/courier/pathaoService");
const {getRandomIntInclusive} = require("@/utils/getRandomNumber");

const orderList = async (req, res) => {

    const type = req.params.type || null;

    try{
        const orders = await getOrderList(type);

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

const changeOrderStatus = async (req,res) => {
    const {orderId, status} = req.body;
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

const makeCourierParcel = async (req,res) => {
    try{

        // Order Detail
        const { } = req.body;

        const tokenData = await getPathaoToken();
        let token ="";
           if(tokenData?.access_token){
                token = tokenData.access_token;
               const randomNumber = getRandomIntInclusive(1,1000);
             //  const store = await createStore(token);
             //  console.log(store);
               const data = {
                   store_id: 150063,
                   merchant_order_id: "ORD-100"+randomNumber,
                   recipient_name: "Demo Recipient",
                   recipient_phone: "01837664478",
                   recipient_address: "House 123, Road 4, Sector 10, Uttara, Dhaka-1230, Bangladesh",
                   delivery_type: 48,
                   item_type: 2,
                   special_instruction: "Need to Delivery before 5 PM",
                   item_quantity: 1,
                   item_weight: "0.5",
                   item_description: "this is a Cloth item, price- 3000",
                   amount_to_collect: 900
               }
               const createCourierOrder =  await createOrder(token, data);
               console.log(createCourierOrder);

               res.json({
                   success: false,
                   data: JSON.stringify(createCourierOrder),
                   message: "Order Created successfully",
               });
           }else{
               res.json({
                   success: false,
                   message: "Token not Create"
               });
           }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get Pathao token"
        });
    }
}

module.exports = {
    orderList,
    makeOrderPaid,
    changeOrderStatus,
    makeCourierParcel
};
