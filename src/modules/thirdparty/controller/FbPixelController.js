const {fetchFbPixelId, updateFbPixelId} = require("@/modules/thirdparty/model/FbPixelModel");
const {updateCourierById} = require("@/modules/thirdparty/model/FbPixelModel");

const getFbId = async (req,res) =>{
    const data =  await fetchFbPixelId();
    res.json(data);
}

const updateFbId = async (req,res) =>{
    try {

        const {
            FB_PIXEL_ID,
            FB_ACCESS_TOKEN,
            TEST_EVENT_ID
        } = req.body;

        if (!FB_PIXEL_ID) {
            return res.status(400).json({
                message: "FB Pixel ID is required",
            });
        }

        if (!FB_ACCESS_TOKEN) {
            return res.status(400).json({
                message: "Access Token must need to input",
            });
        }
        const fbData = await updateFbPixelId(FB_PIXEL_ID,FB_ACCESS_TOKEN,TEST_EVENT_ID);
        if (!fbData) {
            return res.status(404).json({
                message: "Fb Pixel not found",
            });
        }

        return res.status(200).json({
            message: "Courier updated successfully",
            data: fbData,
        });
    } catch (error) {
        console.error("Update courier error:", error);
        return res.status(500).json({
            message: "Failed to update courier",
            error: error.message,
        });
    }
}


module.exports = {
    getFbId,
    updateFbId
}

