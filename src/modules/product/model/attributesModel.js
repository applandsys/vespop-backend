const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const getAllAttributeValues = async () => {
    return prisma.attributeValue.findMany({
        include: {
            attribute: true
        }
    });
}




module.exports = {
    getAllAttributeValues
}
