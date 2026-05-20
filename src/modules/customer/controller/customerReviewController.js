require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const customerReviewSubmit = async (req, res) => {
    try {
        const { rating, comment,productId } = req.body;
        const {id}  = req.user;

        const review = await prisma.productRating.findFirst({
            where:{
                customerId: id,
                productId,
            }
        });

        if(review){
            res.status(400).json({ message: 'Review and Rating already submitted' });
        }

        const reviewCreate =  await prisma.productRating.create({
            data:{
                rating,
                review: comment,
                customerId: id,
                productId,
            }
        });
        res.status(201).json(reviewCreate);
    } catch (error) {
        res.status(500).json({ message: 'Order creation failed', error: error.message });
    }
};


module.exports = {
    customerReviewSubmit
};