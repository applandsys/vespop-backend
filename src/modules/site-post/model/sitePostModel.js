const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const insertPost = (data) => {
    return prisma.blogPost.create({
        data
    });
};

const updatePost = (id,data) => {
    return prisma.blogPost.update({
        where: { id: Number(id) },
        data
    });
};

const fetchPost = () => {
    return prisma.blogPost.findMany();
};

const fetchPostById = (id) => {
    return prisma.blogPost.findFirst({
        where: { id: parseInt(id) }
    });
};

const fetchPostBySlug = (slug) => {
    return prisma.blogPost.findFirst({
        where: { slug }
    });
};


module.exports = {
    insertPost,
    updatePost,
    fetchPost,
    fetchPostById,
    fetchPostBySlug
}