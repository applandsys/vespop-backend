const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const {supplierList, supplierById, createSupplier, updateSupplierById, deleteModel, createSupplierPayment,
    supplierCurrentBalance, supplierDueModel
} = require("@/modules/supplier/model/SupplierModel");

const getSupplier = async (req,res) =>{
    const data = await supplierList();
    res.json(data);
}

const getSupplierById = async (req,res) =>{
    const {id} = req.params;
    const data = await supplierById(id);
    return res.status(200).json({
        success: true,
        message: "success",
        data
    });
}

/*
  name      String?
  address   String?
  phone     String?
  email     String
  password  String
  type      String?
  logo      String?
  slug      String?
  note      String?
  status    ActiveStatus @default(ACTIVE)

 */

const addSupplier = async (req,res) =>{
    try {
        const { name, address , phone, email, password, type, logo, slug, note, status } = req.body;

        if (!name || !email || !password ) {
            return res
                .status(400)
                .json({ message: "Name and email must need to input" });
        }

        const supplier = await createSupplier({name, address , phone, email, password, type, logo, slug, note, status});

        return res.status(200).json({
            message: "Supplier added successfully",
            data:  supplier
        });
    } catch (error) {
        console.error("Add stock error:", error);
        return res
            .status(500)
            .json({ message: "Failed to add stock", error: error.message });
    }
}

const updateSupplier = async (req, res) => {
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

        if (!name) {
            return res.status(400).json({
                message: "Name  must need to input",
            });
        }

        const updateData = {
            name, address , phone, email, password, type, logo, slug, note, status
        };

        if (password && password.trim() !== "") {
            updateData.password = password;
        }

        const supplier = await updateSupplierById(id, updateData);

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


const deleteSupplierById = async (id) => {
    const supplierId = Number(id);

    if (!supplierId || isNaN(supplierId)) {
        throw new Error("Invalid supplier ID");
    }

    // 1️⃣ Check supplier exists
    const supplier = await prisma.supplier.findUnique({
        where: { id: supplierId },
    });

    if (!supplier) {
        throw new Error("Supplier not found");
    }

    // 2️⃣ Check payments exist
    const paymentCount = await prisma.supplierPayment.count({
        where: { supplierId },
    });

    if (paymentCount > 0) {
        throw new Error(
            "Cannot delete supplier: payment history exists"
        );
    }

    // 3️⃣ Check dues exist
    const dueCount = await prisma.supplierDue.count({
        where: { supplierId },
    });

    if (dueCount > 0) {
        throw new Error(
            "Cannot delete supplier: due records exist"
        );
    }

    // 4️⃣ Safe to delete
    return await prisma.supplier.delete({
        where: { id: supplierId },
    });
};

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
 */


const addSupplierPayment = async (req,res) => {
    try {
        const {supplierId, amount, type, typeSourceId, status, method, particular} = req.body;

        if (!supplierId || !amount) {
            return res
                .status(400)
                .json({message: "Supplier and Amount must need to input"});
        }

        const balance = await supplierCurrentBalance(supplierId);

        const payment = await createSupplierPayment({supplierId, amount: Number(amount), type, typeSourceId, status, method, particular, balance : balance - amount});

        return res.status(200).json({
            message: "Supplier Payment successfully",
            data: payment
        });
    } catch (error) {
        console.error("Add stock error:", error);
        return res
            .status(500)
            .json({message: "Failed to add stock", error: error.message});
    }
}

const supplierPaymentDue = async (req, res) => {
    const data = await supplierDueModel();
    res.json(data);
}

const supplierPaymentPaid = async (req, res) => {
    const data = await supplierDueModel();
    res.json(data);
}

module.exports = {
    getSupplier,
    getSupplierById,
    addSupplier,
    updateSupplier,
    deleteSupplierById,
    addSupplierPayment,
    supplierPaymentDue,
    supplierPaymentPaid
}

