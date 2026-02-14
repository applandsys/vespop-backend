require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const {getAllAttributeValues} = require("../../model/attributesModel");
const getPercentToFlat = require("../../../../utils/getPercentToFlat");
const {getProductLabelsModel} = require("../../model/productModel");
const generateSlug = require("../../../../utils/slugGenerate");
const {safeParseJsonArray, toNumberOr} = require("../../../../services/helpers");
const {getAllCategories, getAllCategoriesWithoutCount} = require("@/modules/ecommerce/model/categoryModel");

const categoryById = async (req, res) => {
    const id = req.params.id;
    try{
        const category = await prisma.productCategory.findFirst({
            where: {
                id: id,
            }
        })

        res.status(201).json({
            message: 'Category created successfully',
            data: category,
        });

    }catch(err){
        res.status(500).json({ error: 'Server error' });
    }
}

const addProductCategory = async (req, res) => {

    try {

        const { name, parentId, color } = req.body;

        const image = req.files['image']?.[0]?.filename || null;
        const icon = req.files['icon']?.[0]?.filename || null;
        const slug = generateSlug(name);

        const categoryExist = await prisma.productCategory.findFirst({
            where: { slug }
        });

        if(categoryExist){
            res.status(409).json({
                message: 'Category Already exist',
                data: categoryExist,
            });
        }

        const newCategory = await prisma.productCategory.create({
            data: {
                name,
                slug,
                parentId: parentId ? parseInt(parentId) : null,
                image,
                icon,
                color,
            },
        });

        res.status(201).json({
            message: 'Category created successfully',
            data: newCategory,
        });
    } catch (error) {
        console.error('[Add Category Error]', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const editProductCategory = async (req, res) => {
    try {
        const { id } = req.params; // Get category ID from the route parameter
        const { name, parentId, color } = req.body;

        // Check if category exists
        const existingCategory = await prisma.productCategory.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingCategory) {
            return res.status(404).json({
                message: 'Category not found'
            });
        }

        // Generate a new slug if the name is changed
        const slug = name ? generateSlug(name) : existingCategory.slug;

        // Check if a new image or icon is uploaded, if so, update them
        const image = req.files['image']?.[0]?.filename || existingCategory.image;
        const icon = req.files['icon']?.[0]?.filename || existingCategory.icon;

        // Update the category
        const updatedCategory = await prisma.productCategory.update({
            where: { id: parseInt(id) },
            data: {
                name: name || existingCategory.name,
                slug,
                parentId: parentId ? parseInt(parentId) : existingCategory.parentId,
                image,
                icon,
                color: color || existingCategory.color,
            },
        });

        res.status(200).json({
            message: 'Category updated successfully',
            data: updatedCategory,
        });

    } catch (error) {
        console.error('[Edit Category Error]', error);
        res.status(500).json({ error: 'Server error' });
    }
};



// NORMALIZE Variant
const normalizeVariants = (attributeProducts, modelNumber) => {
    const raw = safeParseJsonArray(attributeProducts);
    return raw
        .map((item) => {
            const attrs = safeParseJsonArray(item?.variantAttributes).map((a) => ({
                attributeValueId: a?.attributeValueId,
            })).filter(a => a.attributeValueId != null);

            return {
                sku: item?.sku || null,
                model: modelNumber || null,
                quantity: toNumberOr(item?.quantity, 0),
                buyPrice: toNumberOr(item?.buyPrice, 0),
                sellPrice: toNumberOr(item?.sellPrice, 0),
                attributes: attrs,
            };
        })
        // Keep only variants that have at least SKU or attributes + a sellPrice
        .filter(v => (v.sku || v.attributes.length) && v.sellPrice != null);
};

const addProduct = async (req, res) => {
    try {
        const {
            name,
            shortDescription,
            specification,
            description,
            categoryId,
            buyPrice,
            sellPrice,
            discount,
            point,
            isFeatured,
            visibility,
            modelNumber,
            attributeProducts,
            productLabels,
            existingImages,
            locations,
            brandId
        } = req.body;

        const slug = generateSlug(name);
        const { id } = req.params;
        const productId = id ? parseInt(id) : null;

        // Check if product already exists (only for create)
        const productExist = await prisma.product.findFirst({
            where: { slug }
        });
        if (!productId && productExist) {
            return res.status(400).json({ success: false, message: "Product already exists" });
        }

        const parsedProductLabels = safeParseJsonArray(productLabels);
        const images = req.files?.["image"] || [];

        const  catNumbers = categoryId.split(',').map(Number); // [1, 2]

        // Handle categories (may come as single or array)
        const categories = catNumbers
            ? (Array.isArray(catNumbers) ? catNumbers : [catNumbers]).map((id) => parseInt(id))
            : [];

        // Validate categories
        if (categories.length) {
            const existingCategories = await prisma.productCategory.findMany({
                where: { id: { in: categories } },
            });
            if (existingCategories.length !== categories.length) {
                return res.status(400).json({ success: false, message: "One or more categories do not exist" });
            }
        }

        // Prepare image data
        const imageData = images.map((image, index) => ({
            name: image.filename,
            altText: name,
            extension: path.extname(image.filename).toLowerCase(),
            type: index === 0 ? "MAIN" : "GALLERY",
            isDefault: index === 0,
        }));

        // Normalize variants
        const productVariants = normalizeVariants(attributeProducts, modelNumber);

        // Calculate discount
        const discountPct = toNumberOr(discount, 0);
        const sell = toNumberOr(sellPrice, 0);
        const discountAmount = discountPct && sell ? getPercentToFlat(discountPct, sell) : 0;

        console.log("Discount amount: ", discount);
        console.log("Discount amount number: ", discountPct);
        console.log("Discount Amount percent: ", discountAmount);

        let newProduct;

        if (productId) {
            // ===================
            // UPDATE PRODUCT FLOW
            // ===================

            // Remove unwanted images
            const keepImageIds = safeParseJsonArray(existingImages)
                .map((img) => img?.id)
                .filter(Boolean);
            if (keepImageIds.length > 0) {
                await prisma.productImage.deleteMany({
                    where: { productId, NOT: { id: { in: keepImageIds } } },
                });
            }

            // Clear old variants (if exist)
            const existing = await prisma.product.findUnique({
                where: { id: productId },
                select: { productVariants: { select: { id: true } } },
            });

            if (existing?.productVariants?.length) {
                const variantIds = existing.productVariants.map((v) => v.id);
                await prisma.variantAttribute.deleteMany({ where: { productVariantId: { in: variantIds } } });
                await prisma.combinedVariantAttribute.deleteMany({ where: { productVariantId: { in: variantIds } } });
                await prisma.productVariant.deleteMany({ where: { id: { in: variantIds } } });
            }

            // Update product
            newProduct = await prisma.product.update({
                where: { id: productId },
                data: {
                    name,
                    slug,
                    shortDescription,
                    description,
                    specification,
                    visibility,
                    brandId: brandId ? parseInt(brandId) : null,
                    buyPrice: buyPrice != null ? toNumberOr(buyPrice, null) : null,
                    sellPrice: sell,
                    discount: discountPct,
                    discountPrice: sell ? sell - discountAmount : null,
                    point: point != null ? toNumberOr(point, 0) : 0,
                    isFeatured: isFeatured === "true" || isFeatured === true,

                    // ✅ Correct: reset all categories before connecting new ones
                    categories: { set: categories.map((id) => ({ id })) },

                    // Optional image uploads
                    images: imageData.length ? { create: imageData } : undefined,

                    // Labels
                    labels: {
                        deleteMany: {}, // Clear existing
                        create: parsedProductLabels.map((label) => ({ labelId: label.id })).filter(Boolean),
                    },

                    // Variants
                    productVariants: productVariants.length
                        ? {
                            create: productVariants.map((variant) => ({
                                sku: variant.sku,
                                model: variant.model,
                                quantity: variant.quantity,
                                buyPrice: variant.buyPrice,
                                sellPrice: variant.sellPrice,
                                variantAttributes: {
                                    create: variant.attributes.map((attr) => ({
                                        attributeValueId: attr.attributeValueId,
                                    })),
                                },
                                CombinedVariantAttribute: {
                                    create: {
                                        attributeValueIds: JSON.stringify(
                                            variant.attributes.map((a) => a.attributeValueId)
                                        ),
                                    },
                                },
                            })),
                        }
                        : undefined,
                },
                include: {
                    categories: true,
                    images: true,
                    labels: true,
                    productVariants: {
                        include: {
                            variantAttributes: { include: { attributeValue: { include: { attribute: true } } } },
                            CombinedVariantAttribute: true,
                        },
                    },
                },
            });
        } else {
            // ===================
            // CREATE PRODUCT FLOW
            // ===================
            newProduct = await prisma.product.create({
                data: {
                    name,
                    slug,
                    shortDescription,
                    description,
                    specification,
                    visibility,
                    brandId: brandId ? parseInt(brandId) : null,
                    buyPrice: buyPrice != null ? toNumberOr(buyPrice, null) : null,
                    sellPrice: sell,
                    discount: discountPct,
                    discountPrice: sell ? sell - discountAmount : null,
                    point: point != null ? toNumberOr(point, 0) : 0,
                    isFeatured: isFeatured === "true" || isFeatured === true,
                    categories: { connect: categories.map((id) => ({ id })) },
                    images: imageData.length ? { create: imageData } : undefined,
                    labels: {
                        create: parsedProductLabels.map((label) => ({ labelId: label.id })).filter(Boolean),
                    },
                    productVariants: productVariants.length
                        ? {
                            create: productVariants.map((variant) => ({
                                sku: variant.sku,
                                model: variant.model,
                                quantity: variant.quantity,
                                buyPrice: variant.buyPrice,
                                sellPrice: variant.sellPrice,
                                variantAttributes: {
                                    create: variant.attributes.map((attr) => ({
                                        attributeValueId: attr.attributeValueId,
                                    })),
                                },
                                CombinedVariantAttribute: {
                                    create: {
                                        attributeValueIds: JSON.stringify(
                                            variant.attributes.map((a) => a.attributeValueId)
                                        ),
                                    },
                                },
                            })),
                        }
                        : undefined,
                },
                include: {
                    categories: true,
                    images: true,
                    labels: true,
                    productVariants: {
                        include: {
                            variantAttributes: { include: { attributeValue: { include: { attribute: true } } } },
                            CombinedVariantAttribute: true,
                        },
                    },
                },
            });
        }

        // ===================
        // LOCATIONS HANDLING
        // ===================
        if (locations) {
            const { primary, city, subcity } = JSON.parse(locations);
            const locationIds = [primary, city, subcity].filter(Boolean);

            for (const locationId of locationIds) {
                await prisma.productLocation.create({
                    data: {
                        productId: newProduct.id,
                        locationId: parseInt(locationId),
                        locationIds: locations,
                    },
                });
            }
        }

        return res.status(201).json({
            success: true,
            message: productId ? "Product updated successfully" : "Product created successfully",
            data: newProduct,
        });
    } catch (error) {
        console.error("[Add/Edit Product Error]", error);
        return res.status(500).json({ success: false, message: "Server error", details: error.message });
    }
};


const addProductAttribute = async (req, res) => {
    try {

       const { value, codeNumber, attributeId } = req.body;

        const attributeValue = await prisma.attributeValue.create({
            data:{
                value,
                codeNumber,
                attributeId: parseInt(attributeId)
            }
        });

        res.status(201).json({
            message: 'Attribute created successfully',
            data: attributeValue,
        });

   } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}


const getAllAttributes = async (req, res) => {
        const attributeValue = await getAllAttributeValues();
        res.status(201).json({
            message: 'Attributes fetched successfully',
            data: attributeValue,
        });
}

const getAllProductLabels = async (req, res) => {
    const productLabels = await getProductLabelsModel();
    res.status(201).json({
        message: 'Labels fetched successfully',
        data: productLabels,
    });
}

const getProductById = async (req, res) => {
    try {

        const { productId } = req.params;
        const parsedId = parseInt(productId);

        if (isNaN(parsedId)) {
            return res.status(400).json({
                error: 'Invalid product ID',
            });
        }

        const product = await prisma.product.findUnique({
            where: {
                id: parsedId, // Use the parsed ID here
            },
            include: {
                categories: true,
                images: true,
                labels: true,
                productVariants: { // updated to plural form
                    include: {
                        variantAttributes: {
                            include: {
                                attributeValue: {
                                    include: {
                                        attribute: true
                                    }
                                }
                            }
                        },
                        CombinedVariantAttribute: true
                    }
                },
                brand: true,
                orderItems: true,
                ratings: true,
                tags: true,
                wishLists: true,
                locations: true,
                productLocations: true
            }
        });


        if (!product) {
            return res.status(404).json({
                error: 'Product not found',
            });
        }

        // Return the fetched product data
        return res.status(200).json({
            message: 'Product fetched successfully',
            data: product,
        });
    } catch (error) {
        console.error('[Get Product by ID Error]', error);
        return res.status(500).json({
            error: 'Server error',
            details: error.message,
        });
    }
};

const addProductBrand = async (req, res) => {

    try {

        const { name, description } = req.body;

        const logo = req.files['image']?.[0]?.filename || null;
        const slug = generateSlug(name);

        const newBrandCreated = await prisma.productBrand.create({
            data: {
                name,
                slug,
                description,
                logo,
            },
        });

        res.status(201).json({
            message: 'Product Brand created successfully',
            data: newBrandCreated,
        });
    } catch (error) {
        console.error('[Add Category Error]', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const allCategories =  async (req,res) => {
    const categories = await getAllCategoriesWithoutCount();
    res.json(categories);
}

module.exports = {
    addProductCategory,
    categoryById,
    addProduct,
    getAllAttributes,
    getAllProductLabels,
    getProductById,
    addProductAttribute,
    addProductBrand,
    allCategories,
    editProductCategory
};
