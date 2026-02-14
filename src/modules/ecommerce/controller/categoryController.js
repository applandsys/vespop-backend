const {getCategory, getCategoryBySlug} = require("../model/categoryModel");
const {getCategoryDetailBySlug} = require("@/modules/ecommerce/model/categoryModel");

const categoryDetail =  async (req,res) => {
    const {id} = req.params;
    const category = await getCategory(id);
    res.json(category);
}

// helper
function getLocationId(req) {
    // 1) Normal case: ?locationId=5
    if (req.query?.locationId != null && req.query.locationId !== '') {
        const n = Number(req.query.locationId);
        return Number.isFinite(n) ? n : undefined;
    }

    // 2) Malformed case: ?{"locationId":5}  (shows up as a single key)
    const q = require('url').parse(req.url, true).query || {};
    const keys = Object.keys(q);
    if (keys.length === 1 && keys[0].trim().startsWith('{')) {
        try {
            const parsed = JSON.parse(keys[0]);
            const n = Number(parsed.locationId);
            if (Number.isFinite(n)) return n;
        } catch {}
    }

    // 3) If it was URL-encoded JSON: ?%7B%22locationId%22%3A5%7D
    const raw = req.url.split('?')[1];
    if (raw) {
        try {
            const decoded = decodeURIComponent(raw);
            if (decoded.trim().startsWith('{')) {
                const parsed = JSON.parse(decoded);
                const n = Number(parsed.locationId);
                if (Number.isFinite(n)) return n;
            }
        } catch {}
    }

    return undefined;
}


const categoryProductDetail = async (req, res) => {
    try {
        const { slug } = req.params;
        const {search} = req.query;

        const category = await getCategoryBySlug(slug,search);

        res.json({
            message: "Category details fetched successfully",
            slug,
            category,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const categoryDetailBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const category = await getCategoryDetailBySlug(slug);

        res.json({
            message: "Category details fetched successfully",
            category,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = {
    categoryDetail,
    categoryProductDetail,
    categoryDetailBySlug
};
