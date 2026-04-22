const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const supplierList = async () => {
    return prisma.supplier.findMany();
}

const supplierById = async (id) => {
    return prisma.supplier.findFirst({
        where: {
            id: parseInt(id)
        }
    })
}

const createSupplier = async (data) => {
    return prisma.supplier.create({
        data: data
    });
}

const updateSupplierById = async (id, data) => {
    return prisma.supplier.update({
        where: { id: Number(id) },
        data,
    });
};

const createSupplierPayment = async (data) => {
    return prisma.supplierPayment.create({
        data: data
    });
}

const createSupplierDue = async (data) => {
    return prisma.supplierDue.create({
        data: data
    });
}

const supplierCurrentBalance = async (supplierId) => {
    // Total Due
    const totalDue = await prisma.supplierDue.aggregate({
        where: { supplierId },
        _sum: { amount: true },
    });

    // Total Paid
    const totalPaid = await prisma.supplierPayment.aggregate({
        where: { supplierId },
        _sum: { amount: true },
    });

    const dueAmount = totalDue._sum.amount || 0;
    const paidAmount = totalPaid._sum.amount || 0;

    return dueAmount - paidAmount;
};


const deleteModel = async (id) => {
    return await prisma.supplier.delete({
        where: { id: Number(id) }
    });
}

const supplierDueModel = async () => {
    return prisma.supplierDue.findMany();
}

const supplierPaidModel = async () => {
    return prisma.supplierPayment.findMany();
}

module.exports = {
    supplierList,
    supplierById,
    createSupplier,
    updateSupplierById,
    createSupplierPayment,
    createSupplierDue,
    supplierCurrentBalance,
    deleteModel,
    supplierDueModel,
    supplierPaidModel
}