const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllCategories = async () => {
    return prisma.productCategory.findMany({
        // where: {
        //     products: {
        //         some: {}, // only categories that have at least one product
        //     },
        // },
        include: {
            parent: true,
            _count: {
                select: {
                    products: true,
                }
            }
        },
    });
}

const getAllCategoriesWithoutCount = async () => {
    return prisma.productCategory.findMany({
        include: {
            parent: true,
            _count: {
                select: {
                    products: true,
                }
            }
        },
    });
}

const getCategory = async (catId) => {
    return prisma.productCategory.findUnique({
        where: {
            id: parseInt(catId)
        },
        include: {
            products: true
        },
    });
}

const getCategoryBySlug = async (slug, searchString, maxprice) => {
    try {
        const includeQuery = {
            images: true,
            labels: true,
            ratings: true,
            productLocations: true,
            productVariants: {
                include: {
                    variantAttributes: true,
                },
            },
        };

        let query = {
            include: {
                products: {
                    include: includeQuery,
                },
            },
        };

        let data = [];

        // --- define aggregate shape
        const priceQuery = {
            _min: { discountPrice: true },
            _max: { discountPrice: true },
        };

        if (slug !== "all") {
            // ✅ keep your category query as-is
            query.where = { slug };
            data = await prisma.productCategory.findFirst(query);

            // ✅ separate aggregate for this category
            const dataPrice = await prisma.product.aggregate({
                ...priceQuery,
                where: {
                    categories: { some: { slug } },
                    ...(maxprice ? { discountPrice: { lt: maxprice } } : {}),
                },
            });

            data = {
                ...data,
                minimumPrice: dataPrice._min.discountPrice,
                maximumPrice: dataPrice._max.discountPrice,
            };
        } else {
            // ✅ "all" products branch
            const dataPrice = await prisma.product.aggregate({
                ...priceQuery,
                where: maxprice ? { discountPrice: { lt: maxprice } } : {},
            });

            let productQuery = {
                include: includeQuery,
            };

            if (searchString && searchString !== "null" && searchString !== "") {
                productQuery.where = {
                    name: {
                        contains: searchString,
                        mode: "insensitive",
                    },
                };
            }

            if (maxprice) {
                productQuery.where = {
                    ...productQuery.where,
                    discountPrice: { lt: maxprice },
                };
            }

            const products = await prisma.product.findMany(productQuery);

            data = {
                category: "All",
                products,
                minimumPrice: dataPrice._min.discountPrice,
                maximumPrice: dataPrice._max.discountPrice,
            };
        }

        return data;
    } catch (error) {
        console.error("Error in getCategoryBySlug:", error);
        return error;
    }
};

const getAllBrands = async () => {
    return prisma.productBrand.findMany({});
}

const insertBrand = async (data) => {
    return prisma.productBrand.create({
        data
    });
}

const getCategoryDetailBySlug = async (catSlug) => {
    return prisma.productCategory.findFirst({
        where: {
            slug: catSlug
        }
    });
}

module.exports = {
    getCategory,
    getCategoryBySlug,
    getAllCategories,
    getAllBrands,
    insertBrand,
    getAllCategoriesWithoutCount,
    getCategoryDetailBySlug
}
