const {supplierList, supplierById, createSupplier, updateSupplierById} = require("@/modules/supplier/model/SupplierModel");

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


module.exports = {
    getSupplier,
    getSupplierById,
    addSupplier,
    updateSupplier
}

