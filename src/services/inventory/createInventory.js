async function createInventory({
                                   productId,
                                   productVariantId = null,
                                   stock = 0,
                                   warehouseId = null,
                               }) {
    return prisma.inventory.upsert({
        where: {
            productId_productVariantId_locationId: {
                productId,
                productVariantId,
                locationId: null, // 🔒 ALWAYS NULL
            },
        },
        update: {},
        create: {
            productId,
            productVariantId,
            locationId: null,
            stock,
            warehouseId,
        },
    });
}