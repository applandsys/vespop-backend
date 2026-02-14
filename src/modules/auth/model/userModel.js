const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getLastUser = ()=>{
    return prisma.customer.findFirst({
        orderBy: {
            id: 'desc'
        }
    });
}


module.exports = getLastUser;