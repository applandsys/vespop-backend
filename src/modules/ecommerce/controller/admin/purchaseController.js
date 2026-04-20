require('dotenv').config();
const {getPurchaseModel, insertPurchaseModel, getPurchaseByIdModel} = require("@/modules/ecommerce/model/admin/purchaseModel");
const {createSupplierPayment, createSupplierDue, supplierCurrentBalance} = require("@/modules/supplier/model/SupplierModel");
const {addStock} = require("@/modules/inventory/model/stockModel");

/*
    model Purchase {
      id         Int      @id @default(autoincrement())
      product    Product  @relation(fields: [productId], references: [id])
      productId  Int
      quantity   Int
      buyPrice   Float
      paidAmount Int?
      dueAmount  Int?
      supplierId Int
      supplier   Supplier @relation(fields: [supplierId], references: [id])
      createdBy  Int?
      createdAt  DateTime @default(now())
    }

 model SupplierPayment {
  id           Int      @id @default(autoincrement())
  supplierId   Int
  supplier     Supplier @relation(fields: [supplierId], references: [id])
  amount       Int
  type         String?
  typeSourceId Int?
  status       String?
  method       String?
  particular   String?
  balance      Int
  createdAt    DateTime @default(now())
}

model SupplierDue {
  id           Int      @id @default(autoincrement())
  supplierId   Int
  supplier     Supplier @relation(fields: [supplierId], references: [id])
  amount       Int
  type         String?
  typeSourceId Int?
  status       String?
  method       String?
  particular   String?
  createdAt    DateTime @default(now())
}

model Inventory {
  id Int @id @default(autoincrement())

  productId Int
  product   Product @relation(fields: [productId], references: [id])

  // NULL = product without variant
  productVariantId Int?
  productVariant   ProductVariant? @relation(fields: [productVariantId], references: [id])

  // NULL = global stock (no location)
  locationId Int?
  location   Location? @relation(fields: [locationId], references: [id])

  stock         Int @default(0)
  reservedStock Int @default(0)

  inventoryMovements InventoryMovement[]

  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  warehouse   Warehouse? @relation(fields: [warehouseId], references: [id])
  warehouseId Int?

  @@unique([productId, productVariantId, locationId])
  @@index([productId])
  @@index([productVariantId])
  @@index([locationId])
}

model InventoryMovement {
  id          Int       @id @default(autoincrement())
  inventoryId Int
  inventory   Inventory @relation(fields: [inventoryId], references: [id])

  type      InventoryMovementType
  quantity  Int
  reference String?
  note      String?
  createdBy Int?

  createdAt DateTime @default(now())

  @@index([inventoryId])
}


*/

const createPurchase = async (req, res) => {
    try {
        const {
            productId,
            quantity,
            buyPrice,
            paidAmount,
            dueAmount,
            supplierId,
        } = req.body;

        const created = await insertPurchaseModel({
            productId,
            quantity,
            buyPrice,
            paidAmount,
            dueAmount,
            supplierId,
        } );

        // Supplier Payment for the paid Amount
        const balance = await supplierCurrentBalance(supplierId);

        if(created && paidAmount > 0){
           await createSupplierPayment({
                supplierId,
                amount: paidAmount,
                type: 'purchase',
                typeSourceId: created.id,
                status: 'paid',
                method: 'unknown',
                particular: 'purchase time payment',
                balance
            })
        }

        if(created && dueAmount > 0){
            await createSupplierDue({
                supplierId,
                amount: dueAmount,
                type: 'purchase',
                typeSourceId: created.id,
                status: 'paid',
                method: 'unknown',
                particular: 'purchase time due'
            })
        }

        if(created){
            await addStock({
                productId,
                productVariantId : null,
                locationId : null,
                quantity,
                reference : "PURCHASE",
                note : "",
                userId : null,
            })
        }

        res.json({
            success: true,
            data: created,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
};

// controllers/purchaseController.js
const getPurchase = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { data, total } = await getPurchaseModel(skip, limit);

        return res.status(200).json({
            success: true,
            purchase: {
                data,
                meta: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};

module.exports = { getPurchase };

const purchaseById = async (req, res) => {
    const { id } = req.params;  // This is for the `PUT` method (existing banner update)
    try{
        const data = await getPurchaseByIdModel(id);
        return res.status(200).json({
            success: true,
            data,
        })
    } catch (error){
        res.status(500).json({success: false});
    }
};

module.exports = {
    createPurchase,
    getPurchase,
    purchaseById
};
