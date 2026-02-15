require('dotenv').config();
const {addCustomerWishListCreate} = require("../model/addProductWishlist");
const {getWishListByCustomerId} = require("@/modules/ecommerce/model/addProductWishlist");

const addWishList = async (req, res) => {
    try {
        const {id: customerId} = req.user;
        const {productId} = req.body;
        const wishlist = await addCustomerWishListCreate( customerId, productId );
        res.status(201).json({message: 'Wish list Added', response: wishlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Wish List add failed', error: error.message });
    }
}

const getWishList = async (req, res) => {
    try {
        const {id: customerId} = req.user;
        const wishlist = await getWishListByCustomerId( customerId );
        res.status(201).json({message: 'Wish List Successfully fetched', response: wishlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Wish List add failed', error: error.message });
    }
}

module.exports = {
    addWishList,
    getWishList
};