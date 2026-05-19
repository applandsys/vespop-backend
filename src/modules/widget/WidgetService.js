const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ==================
// CREATE
// ==================
exports.create = async (data) => {

    return prisma.widget.create({
        data: {
            name: data.name,
            slug: data.slug,
            title: data.title,
            subTitle: data.subTitle,
            imageContent: data.imageContent,
            backgroundColor: data.backgroundColor,
            borderColor: data.borderColor,
            content: data.content,
            cssClasses: data.cssClasses,
            position: data.position,
            jsonContent: data.jsonContent,
            image: data.image,
        }
    });

};

// ==================
// READ ALL
// ==================
exports.findAll = async () => {
    return prisma.widget.findMany({
        orderBy: { createdAt: 'desc' }
    });
};

// ==================
// READ ONE
// ==================
exports.findById = async (id) => {
    return prisma.widget.findUnique({
        where: { id }
    });
};

exports.findBySlug = async (slug) => {
    return prisma.widget.findMany({
        where: {
            slug: slug
        }
    });
};


// ==================
// UPDATE
// ==================
exports.update = async (id, data) => {
    return prisma.widget.update({
        where: { id },
        data: {
            name: data.name,
            title: data.title,
            subTitle: data.subTitle,
            imageContent: data.imageContent,
            backgroundColor: data.backgroundColor,
            borderColor: data.borderColor,
            content: data.content,
            jsonContent: data.jsonContent
        }
    });
};

// ==================
// DELETE
// ==================
exports.remove = async (id) => {
    return prisma.widget.delete({
        where: { id }
    });
};