const {courierList, createCourier} = require("@/modules/thirdparty/model/CoureirModel");


const getCourierList = async (req,res) =>{
    const data = await courierList();
    res.json(data);
}

const addCourier = async (req,res) =>{
    try {
        const { name, url , api_key, username, password, storeId, secret_key, isActive, status } =
            req.body;

        if (!name || !url ) {
            return res
                .status(400)
                .json({ message: "Name and URL must need to input" });
        }

        const courier = await createCourier({name, url , api_key, username, password, storeId, secret_key, isActive, status});

        return res.status(200).json({
            message: "Courier added successfully",
            data:  courier
        });
    } catch (error) {
        console.error("Add stock error:", error);
        return res
            .status(500)
            .json({ message: "Failed to add stock", error: error.message });
    }
}

module.exports = {
    getCourierList,
    addCourier,
}

