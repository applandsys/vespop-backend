const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getCustomerById = async (sponsorId, select = null) => {
    const id = parseInt(sponsorId);
    if (isNaN(id)) {
       return false;
    }

    const queryOptions = {
        where: { id }
    };

    if (select) {
        queryOptions.select = select;
    }

    return prisma.customer.findFirst(queryOptions);
};

const getCustomerByUiId = async (uid, select = null) => {
    if (!uid) {
        return false;
    }

    const queryOptions = {
        where: { uid }
    };

    if (select) {
        queryOptions.select = select;
    }

    return prisma.customer.findFirst(queryOptions);
};



module.exports = {
    getCustomerById,
    getCustomerByUiId
};
