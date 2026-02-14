const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getProductById = async (productId) => {
    return prisma.product.findUnique({
        where: {id: productId},
        include: {
            images: true,
            ratings: true,
            labels: {
                include: {
                    label: true,
                },
            },
            categories: true,
        },
    });
}

const getProductBySlug = async (productSlug) => {
    return prisma.product.findFirst({
        where: {
            slug: productSlug
        },
        include: {
            images: true,
            ratings: true,
            labels: {
                include: {
                    label: true,
                },
            },
            categories: true,
            productLocations: true,
            productVariants: {
                include: {
                    variantAttributes: true
                }
            }
        },
    });
}

const getProductDetailBySlug = async (productSlug) => {
    return prisma.product.findFirst({
        where: {
            slug: productSlug
        },
        include: {
            images: true,
            ratings: true,
            labels: {
                include: {
                    label: true,
                },
            },
            categories: true,
            productLocations: true,
            productVariants: {
                include: {
                    variantAttributes: true
                }
            }
        },
    });
}

const getProductLabelsModel = async () => {
    return prisma.label.findMany();
}

const  getProductAttribute = async () => {
    return prisma.attribute.findMany({
        include: {
            attributeValues: true,
        }
    });
}


module.exports = {
    getProductById,
    getProductLabelsModel,
    getProductAttribute,
    getProductBySlug,
    getProductDetailBySlug
}
