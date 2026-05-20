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

const getCategoriesWithChildren = async () => {
    return prisma.productCategory.findMany({
        where: {
            parentId: null,
        },
        include: {
            childrens: {
                include: {
                    childrens: true, // second level
                },
            },
            _count: {
                select: {
                    products: true,
                },
            },
        },
    });
};


const getCategoriesWithParent = async () => {
    return prisma.productCategory.findMany({
        include: {
            parent: true,
            _count: {
                select: {
                    products: true,
                },
            },
        },
    });
};


const getCategoryWithParentChain = async (id) => {
    return prisma.productCategory.findUnique({
        where: { id },
        include: {
            parent: {
                include: {
                    parent: true,
                },
            },
        },
    });
};

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
        const productInclude = {
            images: true,
            labels: true,
            ratings: true,
            productVariants: {
                include: {
                    variantAttributes: true,
                },
            },
            productLocations: true,
        };

        /* ---------------- CATEGORY BRANCH ---------------- */
        if (slug !== "all") {
            const productWhere = {
                categories: {
                    some: { slug },
                },
                ...(searchString
                    ? {
                        name: {
                            contains: searchString,
                            mode: "insensitive",
                        },
                    }
                    : {}),
                ...(maxprice
                    ? {
                        discountPrice: {
                            lte: maxprice,
                        },
                    }
                    : {}),
            };

            const [category, products, priceAgg] = await Promise.all([
                prisma.productCategory.findFirst({
                    where: { slug },
                }),

                prisma.product.findMany({
                    where: productWhere,
                    include: productInclude,
                }),

                prisma.product.aggregate({
                    _min: { discountPrice: true },
                    _max: { discountPrice: true },
                    where: productWhere,
                }),
            ]);

            return {
                message: "Category details fetched successfully",
                slug,
                category: {
                    ...category,
                    products,
                    minimumPrice: priceAgg._min.discountPrice ?? 0,
                    maximumPrice: priceAgg._max.discountPrice ?? 0,
                },
            };
        }

        /* ---------------- ALL PRODUCTS BRANCH ---------------- */
        const productWhere = {
            ...(searchString
                ? {
                    name: {
                        contains: searchString,
                        mode: "insensitive",
                    },
                }
                : {}),
            ...(maxprice
                ? {
                    discountPrice: {
                        lte: maxprice,
                    },
                }
                : {}),
        };

        const [products, priceAgg] = await Promise.all([
            prisma.product.findMany({
                where: productWhere,
                include: productInclude,
            }),

            prisma.product.aggregate({
                _min: { discountPrice: true },
                _max: { discountPrice: true },
                where: productWhere,
            }),
        ]);

        return {
            message: "All products fetched successfully",
            slug: "all",
            category: {
                name: "All",
                products,
                minimumPrice: priceAgg._min.discountPrice ?? 0,
                maximumPrice: priceAgg._max.discountPrice ?? 0,
            },
        };
    } catch (error) {
        console.error("Error in getCategoryBySlug:", error);
        throw error;
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
    getCategoryDetailBySlug,
    getCategoriesWithChildren,
    getCategoriesWithParent,
    getCategoryWithParentChain
}
