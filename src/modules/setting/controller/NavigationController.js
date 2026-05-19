// src/controllers/navigation.controller.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * CREATE
 */
exports.createNavigation = async (req, res) => {
    try {
        const data = req.body;

        const nav = await prisma.siteNavigation.create({
            data: {
                position: data.position,
                label: data.label,
                url: data.url,
                slug: data.slug,
                icon: data.icon,
                cssClasses: data.cssClasses,
                cssRaw: data.cssRaw,
                textColor: data.textColor,
                type: data.type,

                // ✅ correct Prisma relation handling
                parent: data.parentId
                    ? {
                        connect: {
                            id: Number(data.parentId),
                        },
                    }
                    : undefined,
            },
        });

        res.status(201).json({
            success: true,
            data: nav,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

/**
 * READ (TREE for FRONTEND)
 * 3-level dropdown ready
 */
exports.getAllNavigationTree = async (req, res) => {
    try {
        const { position = "header" } = req.query;

        const navigation = await prisma.siteNavigation.findMany({
            where: {
                position: position,
                parentId: null, // ✅ ONLY ROOT LEVEL
            },
            orderBy: {
                id: "asc",
            },
            include: {
                childrens: {
                    orderBy: {
                        id: "asc",
                    },
                    include: {
                        childrens: {
                            orderBy: {
                                id: "asc",
                            },
                        },
                    },
                },
            },
        });

        res.json({
            success: true,
            data: navigation,
        });
    } catch (error) {
        res.json({
            success: false,
            error: error.message,
        });
    }
};

/**
 * READ SINGLE
 */
exports.getNavigationById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const nav = await prisma.siteNavigation.findUnique({
            where: { id },
            include: {
                childrens: true,
            },
        });

        res.json({ success: true, data: nav });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * UPDATE
 */
exports.updateNavigation = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const data = req.body;

        const nav = await prisma.siteNavigation.update({
            where: { id },
            data: {
                position: data.position,
                label: data.label,
                url: data.url,
                slug: data.slug,
                icon: data.icon,
                cssClasses: data.cssClasses,
                cssRaw: data.cssRaw,
                textColor: data.textColor,
                type: data.type,

                parent: data.parentId
                    ? { connect: { id: Number(data.parentId) } }
                    : { disconnect: true },
            },
        });

        res.json({ success: true, data: nav });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * DELETE (CASCADE SAFE)
 */
exports.deleteNavigation = async (req, res) => {
    try {
        const id = Number(req.params.id);

        // Delete children first
        await prisma.siteNavigation.deleteMany({
            where: { parentId: id },
        });

        await prisma.siteNavigation.delete({
            where: { id },
        });

        res.json({ success: true, message: 'Navigation deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};