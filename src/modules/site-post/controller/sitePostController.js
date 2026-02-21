const {insertPost, fetchPost, fetchPostBySlug, fetchPostById, updatePost} = require("@/modules/site-post/model/sitePostModel");
const generateSlug = require("@/utils/slugGenerate");

const addSitePost = async (req, res) => {
    try {
        const { title, excerpt, content ,metaKeywords, seoMeta, categoryId} = req.body;
        const featuredImage = req.files['featuredImage']?.[0]?.filename || null;
        const slug = generateSlug(title);

        const post = await insertPost(
            {
                    title,
                    slug,
                    excerpt,
                    content,
                    type: 'page',
                    featuredImage,
                    metaKeywords : 'Page',
                    seoMeta: '',
                    userId: 1,
                    categoryId: 1
                },
        ); // ✅ USE DIRECTLY
        return res.status(200).json({
            success: true,
            post
        });
    } catch (error) {
        console.error("Post Insert Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to Insert Post"
        });
    }
};

const updateSitePost = async (req, res) => {
    try {
        const { id, title, excerpt, content, metaKeywords, seoMeta, categoryId } = req.body;

        const featuredImage =
            req.files?.['featuredImage']?.[0]?.filename || undefined;

        const slug = generateSlug(title);

        const post = await updatePost(id, {
            title,
            slug,
            excerpt,
            content,
            type: "page",
            ...(featuredImage && { featuredImage }), // only if uploaded
            metaKeywords: metaKeywords || "Page",
            seoMeta: seoMeta || "",
            userId: 1,
            categoryId: categoryId || 1
        });

        return res.status(200).json({
            success: true,
            post
        });
    } catch (error) {
        console.error("Post Update Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to Update Post"
        });
    }
};

const getSitePost = async (req, res) => {
    try {
        const post = await fetchPost(); // ✅ USE DIRECTLY
        return res.status(200).json({
            success: true,
            post
        });
    } catch (error) {
        console.error("Post Fetch Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to Fetch Post"
        });
    }
};

const getSitePostById = async (req, res) => {
    try {
        const {postId} = req.params;
        const post = await fetchPostById(postId); // ✅ USE DIRECTLY
        return res.status(200).json({
            success: true,
            post
        });
    } catch (error) {
        console.error("Post Insert Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to Insert Post"
        });
    }
};

const getSitePostBySlug = async (req, res) => {
    try {
        const {slug} = req.params;
        const post = await fetchPostBySlug(slug); // ✅ USE DIRECTLY
        return res.status(200).json({
            success: true,
            post
        });
    } catch (error) {
        console.error("Post Fetch Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to Fetch Post"
        });
    }
};




module.exports = {
    addSitePost,
    updateSitePost,
    getSitePost,
    getSitePostById,
    getSitePostBySlug
};
