const {
    insertShippingCost,
    shippingCostList,
    shippingCostById,
    updateShippingCost
} = require("@/modules/setting/model/ShippingModel");

/**
 * CREATE
 */
const createShippingCost = async (req, res) => {
    try {
        const {
            location = null,
            price = null,
            isByLocation = false,
            isFree = false,
            extData = {}
        } = req.body;

        const shipping = await insertShippingCost({
            location,
            price,
            isByLocation,
            isFree,
            extData
        });

        res.status(201).json({
            success: true,
            data: shipping
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

/**
 * LIST
 */
const getShippingCost = async (req, res) => {
    try {
        const list = await shippingCostList();

        res.json({
            success: true,
            count: list.length,
            data: list
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * GET BY ID
 */
const shippingCostByIdController = async (req, res) => {
    try {
        const shipping = await shippingCostById(req.params.id);

        if (!shipping) {
            return res.status(404).json({
                success: false,
                message: "Shipping cost not found"
            });
        }

        res.json({
            success: true,
            data: shipping
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * UPDATE
 */
const updateShippingCostController = async (req, res) => {
    try {
        const shipping = await updateShippingCost(req.params.id, req.body);

        res.json({
            success: true,
            data: shipping
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
    createShippingCost,
    getShippingCost,
    updateShippingCost: updateShippingCostController,
    shippingCostById: shippingCostByIdController
};