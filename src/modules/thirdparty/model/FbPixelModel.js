const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const fetchFbPixelId = async () => {
    return prisma.fBPixelSetup.findFirst();
}

const updateFbPixelId = async (pixelId,accessToken,testEventId) => {
    return await prisma.fBPixelSetup.upsert({
        where: { id: 1 }, // must be UNIQUE
        update: {
            pixelId,
            metaAccesstoken: accessToken,
            testEventId
        },
        create: {
            pixelId,
            metaAccesstoken: accessToken,
            testEventId
        },
    });
}


module.exports = {
    fetchFbPixelId,
    updateFbPixelId
}