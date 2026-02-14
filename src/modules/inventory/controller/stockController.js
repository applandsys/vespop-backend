const {
    getProductStockReport,
    buildStockReport, addStock,
} = require("@/modules/inventory/model/stockModel");

const productStock = async (req, res) => {
    try {
        const report = await getProductStockReport(); // ✅ USE DIRECTLY

        return res.status(200).json({
            success: true,
            count: report.length,
            data: report,
        });
    } catch (error) {
        console.error("Product Stock Report Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate stock report",
        });
    }
};


/**
 * Add stock to a product / variant / location
 * POST /api/admin/stock/add
 * Body: { productId, productVariantId?, locationId?, quantity }
 */
const addProductStock = async (req, res) => {
    try {
        const { productId, productVariantId = null, locationId = null, quantity } =
            req.body;

        if (!productId || !quantity || quantity <= 0) {
            return res
                .status(400)
                .json({ message: "productId and positive quantity are required" });
        }

        // Optional: if you have user/admin auth, use req.user.id
        const updatedInventory = await addStock({
            productId,
            productVariantId,
            locationId,
            quantity,
            reference: "MANUAL_ADD",
            note: "Added via admin panel",
            userId: req.user?.id || null,
        });

        return res.status(200).json({
            message: "Stock added successfully",
            inventory: updatedInventory,
        });
    } catch (error) {
        console.error("Add stock error:", error);
        return res
            .status(500)
            .json({ message: "Failed to add stock", error: error.message });
    }
};

const reserveStock = async ({
                                productId,
                                productVariantId = null,
                                locationId = null,
                                quantity,
                            }) => {
    return prisma.inventory.updateMany({
        where: { productId, productVariantId, locationId },
        data: {
            reservedStock: { increment: quantity },
        },
    });
};

/// WHEN ORDER SHIPPED
/*
await removeStock({
    productId,
    productVariantId,
    locationId,
    quantity,
    reference: `ORDER#${orderId}`,
});

releaseReservedStock(...)

3. Reserve stock (when order placed but not shipped)

Very important for reservedStock.

const reserveStock = async ({
  productId,
  productVariantId = null,
  locationId = null,
  quantity,
}) => {
  return prisma.inventory.updateMany({
    where: { productId, productVariantId, locationId },
    data: {
      reservedStock: { increment: quantity },
    },
  });
};

https://chatgpt.com/share/697dece1-7838-8006-a61d-343e378fbcd5
 **/

module.exports = {
    productStock,
    addProductStock
};
