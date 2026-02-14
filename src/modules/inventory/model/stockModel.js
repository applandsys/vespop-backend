const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getVariantName = (variant) => {
    if (!variant || !variant.variantAttributes?.length) {
        return "no-variant";
    }

    return variant.variantAttributes
        .map((va) => va.attributeValue.value)
        .join(" / ");
};


const inventoryWhere = ({ productId, productVariantId, locationId }) => ({
    productId,
    productVariantId:
        productVariantId === null ? { equals: null } : productVariantId,
    locationId:
        locationId === null ? { equals: null } : locationId,
});


const getProductStockReport = async () => {
    try {
        // 1️⃣ Get ALL products with variants
        const products = await prisma.product.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                productVariants: {
                    include: {
                        variantAttributes: {
                            include: {
                                attributeValue: true,
                            },
                        },
                    },
                },
            },
        });

        // 2️⃣ Get ALL inventories
        const inventories = await prisma.inventory.findMany({
            include: {
                location: true,
                inventoryMovements: {
                    select: { createdAt: true },
                    orderBy: { createdAt: "desc" },
                    take: 1,
                },
            },
        });

        // 3️⃣ Index inventories for fast lookup
        const invMap = {};
        for (const inv of inventories) {
            const key = `${inv.productId}-${inv.productVariantId ?? "no-variant"}`;

            if (!invMap[key]) invMap[key] = [];
            invMap[key].push(inv);
        }

        // 4️⃣ Build report from products (LEFT JOIN style)
        const report = [];

        for (const product of products) {
            let totalStock = 0;
            let totalReserved = 0;
            const variants = {};

            // ✅ Handle real variants
            if (product.productVariants.length > 0) {
                for (const variant of product.productVariants) {
                    const key = `${product.id}-${variant.id}`;
                    const invs = invMap[key] || [];

                    let vStock = 0;
                    let vReserved = 0;
                    const locations = [];

                    for (const inv of invs) {
                        vStock += inv.stock;
                        vReserved += inv.reservedStock;

                        locations.push({
                            location: inv.location?.name || "N/A",
                            stock: inv.stock,
                            reserved: inv.reservedStock,
                            available: inv.stock - inv.reservedStock,
                            lastMovement:
                                inv.inventoryMovements?.[0]?.createdAt || null,
                        });
                    }

                    variants[variant.id] = {
                        variantName: getVariantName(variant),
                        stock: vStock,          // 0 if no inventory
                        reserved: vReserved,
                        locations,
                    };

                    totalStock += vStock;
                    totalReserved += vReserved;
                }
            }

            // ✅ Handle no-variant stock
            const noVarKey = `${product.id}-no-variant`;
            const noVarInvs = invMap[noVarKey] || [];

            let nvStock = 0;
            let nvReserved = 0;
            const nvLocations = [];

            for (const inv of noVarInvs) {
                nvStock += inv.stock;
                nvReserved += inv.reservedStock;

                nvLocations.push({
                    location: inv.location?.name || "N/A",
                    stock: inv.stock,
                    reserved: inv.reservedStock,
                    available: inv.stock - inv.reservedStock,
                    lastMovement:
                        inv.inventoryMovements?.[0]?.createdAt || null,
                });
            }

            // If product has no variants at all, still show Default
            if (product.productVariants.length === 0 || noVarInvs.length > 0) {
                variants["no-variant"] = {
                    variantName: "no-variant",
                    stock: nvStock,      // 0 if not exist
                    reserved: nvReserved,
                    locations: nvLocations,
                };

                totalStock += nvStock;
                totalReserved += nvReserved;
            }

            report.push({
                productId: product.id,
                productName: product.name,
                slug: product.slug,
                totalStock,
                totalReserved,
                totalAvailable: totalStock - totalReserved,
                variants,
            });
        }

        return report;
    } catch (error) {
        console.error("Stock report error:", error);
        throw error;
    }
};


const buildStockReport = (products) => {

    return products.map((product) => {
        let totalStock = 0;
        let totalReserved = 0;
        const variants = [];

        if (product.productVariants && product.productVariants.length > 0) {
            // Product has variants
            for (const variant of product.productVariants) {
                let variantStock = 0;
                let variantReserved = 0;
                const locations = [];

                for (const inv of variant.inventories || []) {
                    variantStock += inv.stock;
                    variantReserved += inv.reservedStock;

                    locations.push({
                        location: inv.location?.name || "N/A",
                        stock: inv.stock,
                        reserved: inv.reservedStock,
                        available: inv.stock - inv.reservedStock,
                        lastMovement: inv.inventoryMovements?.[0]?.createdAt || null,
                    });
                }

                totalStock += variantStock;
                totalReserved += variantReserved;

                variants.push({
                    variantId: variant.id,
                    sku: variant.sku || "N/A",
                    stock: variantStock,
                    reserved: variantReserved,
                    available: variantStock - variantReserved,
                    locations,
                });
            }
        } else {
            // Product has no variants
            let variantStock = 0;
            let variantReserved = 0;
            const locations = [];

            for (const inv of product.inventories || []) {
                variantStock += inv.stock;
                variantReserved += inv.reservedStock;

                locations.push({
                    location: inv.location?.name || "N/A",
                    stock: inv.stock,
                    reserved: inv.reservedStock,
                    available: inv.stock - inv.reservedStock,
                    lastMovement: inv.inventoryMovements?.[0]?.createdAt || null,
                });
            }

            totalStock += variantStock;
            totalReserved += variantReserved;

            variants.push({
                variantId: null,
                sku: "no-variant",
                stock: variantStock,
                reserved: variantReserved,
                available: variantStock - variantReserved,
                locations,
            });
        }

        return {
            productId: product.productId ,
            productName: product.productName,
            slug: product.slug,
            totalStock,
            totalReserved,
            totalAvailable: totalStock - totalReserved,
            variants,
        };
    });
};


const addStock = async ({
                            productId,
                            productVariantId = null,
                            locationId = null,
                            quantity,
                            reference = "PURCHASE",
                            note = "",
                            userId = null,
                        }) => {

    // ✅ Convert to integers safely
    productId = parseInt(productId);
    productVariantId = productVariantId !== null ? parseInt(productVariantId) : null;
    locationId = locationId !== null ? parseInt(locationId) : null;
    quantity = parseInt(quantity);

    return prisma.$transaction(async (tx) => {

        const existingInventory = await tx.inventory.findFirst({
            where: inventoryWhere({ productId, productVariantId, locationId }),
            select: { id: true },
        });

        let inventory;

        if (existingInventory) {
            inventory = await tx.inventory.update({
                where: { id: existingInventory.id },
                data: { stock: { increment: quantity } },
            });
        } else {
            inventory = await tx.inventory.create({
                data: {
                    productId,
                    productVariantId,
                    locationId,
                    stock: quantity,
                },
            });
        }

        await tx.inventoryMovement.create({
            data: {
                inventoryId: inventory.id,
                type: "IN",
                quantity,
                reference,
                note,
                createdBy: userId,
            },
        });

        return inventory;
    });
};



const removeStock = async ({
                               productId,
                               productVariantId = null,
                               locationId = null,
                               quantity,
                               reference = "ORDER",
                               note = "",
                               userId = null,
                           }) => {
    return prisma.$transaction(async (tx) => {

        const inventory = await tx.inventory.findFirst({
            where: inventoryWhere({ productId, productVariantId, locationId }),
        });

        if (!inventory) throw new Error("Inventory not found");

        if (inventory.stock - inventory.reservedStock < quantity)
            throw new Error("Insufficient available stock");

        const updatedInventory = await tx.inventory.update({
            where: { id: inventory.id },
            data: { stock: { decrement: quantity } },
        });

        await tx.inventoryMovement.create({
            data: {
                inventoryId: inventory.id,
                type: "OUT",
                quantity: -quantity,
                reference,
                note,
                createdBy: userId,
            },
        });

        return updatedInventory;
    });
};



const reserveStock = async ({
                                productId,
                                productVariantId = null,
                                locationId = null,
                                quantity,
                            }) => {
    return prisma.$transaction(async (tx) => {

        const inventory = await tx.inventory.findFirst({
            where: inventoryWhere({ productId, productVariantId, locationId }),
        });

        if (!inventory) throw new Error("Inventory not found");

        if (inventory.stock - inventory.reservedStock < quantity)
            throw new Error("Not enough stock to reserve");

        return tx.inventory.update({
            where: { id: inventory.id },
            data: { reservedStock: { increment: quantity } },
        });
    });
};

const releaseReservedStock = async ({
                                        productId,
                                        productVariantId = null,
                                        locationId = null,
                                        quantity,
                                    }) => {
    return prisma.inventory.updateMany({
        where: inventoryWhere({ productId, productVariantId, locationId }),
        data: {
            reservedStock: { decrement: quantity },
        },
    });
};

module.exports = {
    getProductStockReport,
    buildStockReport,
    addStock,
    removeStock,
    reserveStock,
    releaseReservedStock
};