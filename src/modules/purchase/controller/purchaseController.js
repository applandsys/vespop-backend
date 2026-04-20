const {purchaseList, purchaseById, updatePurchaseById, createPurchase} = require("@/modules/purchase/model/purchaseModel");
const {createSupplierPayment} = require("@/modules/supplier/model/SupplierModel");

const getPurchase = async (req,res) =>{
    const data = await purchaseList();
    res.json(data);
}

const getPurchaseById = async (req,res) =>{
    const {id} = req.params;
    const data = await purchaseById(id);
    return res.status(200).json({
        success: true,
        message: "success",
        data
    });
}

/*

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

 Relation:
 ========
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
          createdAt    DateTime @default(now())
       }

*/

const addPurchase = async (req,res) =>{
    try {
        const { productId, quantity , buyPrice, paidAmount, dueAmount, supplierId , method , particular } = req.body;

        const amount = quantity * buyPrice;
        const type = "purchase";
        const status = "pending";

        if (!productId || !quantity || !buyPrice || !supplierId) {
            return res
                .status(400)
                .json({ message: "Necessary Input Missing" });
        }

        const purchase = await createPurchase({productId, quantity , buyPrice, paidAmount, dueAmount, supplierId});

        // Supplier payment table  create korte hobe
        // Due table theke total due ber kore payment minus kore balance
        // Due thakle due paymnet age dite hobe
        const balance = 0;

        if(purchase){
            const typeSourceId =  purchase.id;
            await createSupplierPayment({supplierId,amount,type,typeSourceId,status,method,particular,balance});
        }

        return res.status(200).json({
            message: "Purchase created successfully",
            data:  purchase
        });

    } catch (error) {
        console.error("Add stock error:", error);
        return res
            .status(500)
            .json({ message: "Failed to add stock", error: error.message });
    }
}

const updatePurchase = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name, address , phone, email, password, type, logo, slug, note, status
        } = req.body;

        if (!id) {
            return res.status(400).json({
                message: "Courier ID is required",
            });
        }

        if (!name || !url) {
            return res.status(400).json({
                message: "Name and URL must need to input",
            });
        }

        const updateData = {
            name, address , phone, email, password, type, logo, slug, note, status
        };

        if (password && password.trim() !== "") {
            updateData.password = password;
        }

        const supplier = await updatePurchaseById(id, updateData);

        if (!supplier) {
            return res.status(404).json({
                message: "Supplier not found",
            });
        }

        return res.status(200).json({
            message: "Supplier updated successfully",
            data: supplier,
        });
    } catch (error) {
        console.error("Update courier error:", error);
        return res.status(500).json({
            message: "Failed to update courier",
            error: error.message,
        });
    }
};


module.exports = {
    getPurchase,
    getPurchaseById,
    addPurchase,
    updatePurchase
}

