const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getReviews = async (status="approved",skip = 0, limit = 50) => {
    const whereCondition = {
        status
    };

    const [data, total] = await Promise.all([
        prisma.productRating.findMany({
            where: whereCondition,
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                supplier: true,
                product: true,
            },
        }),
        prisma.productRating.count({
            where: whereCondition,
        }),
    ]);

    return { data, total };
};


const updateProductRatingStatus = async (
    ratingId,
    status
) => {
    return prisma.productRating.update({
        where: { id: ratingId },
        data: { status },
    });
};


// ratingIds []
const bulkApproveProductRatings = async (ratingIds) => {
    if (!ratingIds || ratingIds.length === 0) {
        throw new Error("No rating IDs provided");
    }

    return prisma.productRating.updateMany({
        where: {
            id: {
                in: ratingIds,
            },
        },
        data: {
            status: "approved",
        },
    });
};

module.exports = {
    getReviews,
    updateProductRatingStatus,
    bulkApproveProductRatings
}