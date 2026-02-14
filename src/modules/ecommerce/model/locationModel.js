const { PrismaClient } = require('@prisma/client');
const generateSlug = require("../../../utils/slugGenerate");
const prisma = new PrismaClient();


const getPrimaryLocations = async () => {
    return prisma.location.findMany({
        where:{
            parentId: null
        }
    });
}

const getAllLocations = async () => {
    return prisma.location.findMany({
        include: {
            parent: true
        }
    });
}

const getAllLocationsByLevel = async (level) => {
    return prisma.location.findMany({
        where:{
            level
        }
    });
}

const getAllLocationsByParentId = async (parentId) => {
    return prisma.location.findMany(
        {
            where:{
                parentId
            }
        }
    );
}

const getLocationByParentId = async (parentId) => {
    return prisma.location.findMany({
        where:{
            parentId
        }
    });
}

const getLocationWithChildren = async (parentId) => {
    return prisma.location.findMany({
        where:{
            parentId
        },
        include:{
            children: true
        }
    });
}

const getLocationWithParent = async (parentId) => {
    return prisma.location.findMany({
        where:{
            parentId
        },
        include:{
            parent: true
        }
    });
}

const insertLocation = async (data) => {
    const { name,slug, parentId, level } = data;

    const existingLocation = await prisma.location.findUnique({
        where: { slug },
    });

    if (existingLocation) {
        throw new Error('Slug must be unique. The provided slug already exists.');
    }

    return prisma.location.create({
        data: {
            name,
            slug,
            parentId,
            level,
        },
    });
};


const updateLocationInDatabase = async (id, data) => {
    return prisma.location.update(data, {where: {id}});
};



module.exports = {
    getPrimaryLocations,
    getAllLocations,
    getAllLocationsByLevel,
    getLocationByParentId,
    getLocationWithChildren,
    getLocationWithParent,
    insertLocation,
    updateLocationInDatabase,
    getAllLocationsByParentId
}
