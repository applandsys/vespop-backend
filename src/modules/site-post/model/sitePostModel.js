const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const insertPost = (data) => {
    return prisma.blogPost.create({
        data
    });
};

const fetchPost = (data) => {
    return prisma.blogPost.findMany();
};

const fetchPostById = (id) => {
    return prisma.blogPost.findFirst({
        where: { id }
    });
};

const fetchPostBySlug = (slug) => {
    return prisma.blogPost.findFirst({
        where: { slug }
    });
};


module.exports = {
    insertPost,
    fetchPost,
    fetchPostById,
    fetchPostBySlug
}