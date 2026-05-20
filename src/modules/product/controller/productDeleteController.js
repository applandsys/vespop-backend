const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const deleteProduct = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ message: "Invalid product ID" });

        // Start transaction to delete all dependent records first
        await prisma.$transaction([
            // Product related
            prisma.productLabel.deleteMany({ where: { productId: id } }),
            prisma.productImage.deleteMany({ where: { productId: id } }),
            prisma.productLocation.deleteMany({ where: { productId: id } }),
            prisma.productRating.deleteMany({ where: { productId: id } }),
            prisma.customerWishList.deleteMany({ where: { productId: id } }),
            prisma.productTag.deleteMany({ where: { productId: id } }),
            prisma.orderItem.deleteMany({ where: { productId: id } }),

            // Variant related
            prisma.variantAttribute.deleteMany({
                where: {
                    productVariant: { productId: id }
                }
            }),
            prisma.combinedVariantAttribute.deleteMany({
                where: {
                    productVariantId: {
                        in: (
                            await prisma.productVariant.findMany({
                                where: { productId: id },
                                select: { id: true }
                            })
                        ).map(v => v.id)
                    }
                }
            }),
            prisma.productVariant.deleteMany({ where: { productId: id } })
        ]);

        // Delete the product itself
        const deletedProduct = await prisma.product.delete({
            where: { id }
        });

        return res.status(200).json({
            message: "Product and all related entities deleted successfully",
            product: deletedProduct
        });

    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { deleteProduct };
