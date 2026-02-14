const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getVendorList = async () => {
    const allVendor = await prisma.distributionHub.findMany();
    return allVendor || false;
}


module.exports = {
    getVendorList
}