const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getReviews,
    bulkApproveProductRatings} = require("@/modules/ecommerce/model/admin/reviewModel.js");


const approved = async (req, res) => {
    try {
        const reviews = await getReviews();
        res.status(201).json({
            message: 'Approved Review List successfully',
            data: reviews,
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

const pending = async (req, res) => {
    try {
        const reviews = await getReviews("pending");
        res.status(201).json({
            message: 'Pending Review List successfully',
            data: reviews,
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.body;

        const ratingId = Number(id);

        if (!ratingId) {
            return res.status(400).json({
                success: false,
                message: "Invalid rating ID",
            });
        }

        if (!["approve", "reject"].includes(action)) {
            return res.status(400).json({
                success: false,
                message: "Invalid action. Use 'approve' or 'reject'",
            });
        }

        const rating = await prisma.productRating.findUnique({
            where: { id: ratingId },
        });

        if (!rating) {
            return res.status(404).json({
                success: false,
                message: "Product rating not found",
            });
        }

        const status = action === "approve" ? "approved" : "rejected";

        const updated = await prisma.productRating.update({
            where: { id: ratingId },
            data: { status },
        });

        return res.status(200).json({
            success: true,
            message: `Rating ${status} successfully`,
            data: updated,
        });
    } catch (error) {
        console.error("Moderation error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const bulkApprove = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                message: "Rating IDs are required",
            });
        }

        const ratingIds = ids.map(Number).filter(Boolean);

        const result = await bulkApproveProductRatings(ratingIds);

        return res.status(200).json({
            success: true,
            message: "Product ratings approved successfully",
            updatedCount: result.count,
        });
    } catch (error) {
        console.error("Bulk approve error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

module.exports = {
    approved,
    pending,
    update,
    bulkApprove
}