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


module.exports = {
    insertPost,
    fetchPost
}