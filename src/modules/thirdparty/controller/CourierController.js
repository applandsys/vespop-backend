const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const {courierList, createCourier, ActiveCourierList, courierById, updateCourierById} = require("@/modules/thirdparty/model/CoureirModel");

const getCourierList = async (req,res) =>{
    const data = await courierList();
    res.json(data);
}

const getActiveCourierList = async (req,res) =>{
    const data = await ActiveCourierList();
    res.json(data);
}

const getCourierById = async (req,res) =>{
    const {id} = req.params;
    const data = await courierById(id);
    return res.status(200).json({
        success: true,
        message: "success",
        data
    });
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

const updateCourier = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            url,
            api_key,
            username,
            password,
            storeId,
            secret_key,
            isActive,
            status,
        } = req.body;

        if (!id) {
            return res.status(400).json({
                message: "Courier ID is required",
            });
        }

        if (!name || !url) {
            return res.status(400).json({
                message: "Name and URL must need to input",
            });
        }

        /* ----------------------------------
           BUILD UPDATE PAYLOAD (SAFE)
        ---------------------------------- */
        const updateData = {
            name,
            url,
            api_key,
            username,
            storeId,
            isActive,
            status,
        };

        // Only update sensitive fields if provided
        if (password && password.trim() !== "") {
            updateData.password = password;
        }

        if (secret_key && secret_key.trim() !== "") {
            updateData.secret_key = secret_key;
        }

        const courier = await updateCourierById(id, updateData);

        if (!courier) {
            return res.status(404).json({
                message: "Courier not found",
            });
        }

        return res.status(200).json({
            message: "Courier updated successfully",
            data: courier,
        });
    } catch (error) {
        console.error("Update courier error:", error);
        return res.status(500).json({
            message: "Failed to update courier",
            error: error.message,
        });
    }
};


const getAnalytics  = async (req,res) =>{
    const total = await prisma.shipment.count();
    const byCourier = await prisma.shipment.groupBy({
        by: ["courierName"],
        _count: { _all: true },
        _sum: { price: true },
    });
    res.json({ total, byCourier });

}


module.exports = {
    getCourierList,
    getActiveCourierList,
    getCourierById,
    addCourier,
    updateCourier,
    getAnalytics
}

