require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getReviewsByProductId = async (req,res) => {
    try{
        const {productId} = req.params;
        const productReviews = await prisma.productRating.findMany({
            where: {
                productId: parseInt(productId)
            },
            include:{
                customer: true
            }
        });

        res.status(201).json(productReviews);
    }catch(err){
        res.status(500).json({ message: 'Review fetch failed', error: err });
    }
}

module.exports ={
    getReviewsByProductId
}