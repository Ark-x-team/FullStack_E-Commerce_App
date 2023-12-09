const Product = require("../models/Product"); 
const fs = require('fs'); 

// ******************************* Create product ************************************
const createProduct = async (req, res) => {
    try {
        // Get product data
        const { sku, product_name, price, discount_price, short_description, long_description,
             active, subcategory_id, hide } = req.body; 
        
        // Get images files
        const files = req.files; 

        // Check product existence using name and serialization
        const productExist = await Product.findOne({$or: [{sku}, {product_name}]});
        if (productExist) {
            return res.status(400).json({
                status: 400,
                message: "Product already exists, check the name and the serialization"
            })
        } else {
            // Check files existence and attach filenames to product_images
            let product_images = "default-product-image"
            if (files.length > 0) {

                // Store images in uploads folder
                files.forEach((file) => {
                    const filePath = `public/uploads/${file.filename}`;
                    fs.rename(file.path, filePath, (error) => {
                        if (error) return res.status(500).json({
                            status: 500,
                            message: 'Failed to store the images files'
                        })
                    })
                });
                product_images = files.map(file => file.filename)
            } 

            // Post product data
            await Product.create({
                sku, product_name, product_images, price, discount_price,
                short_description, long_description,  active, subcategory_id
            })
            res.status(200).json({ status: 200, message: "product created successfully" })
        }
    } catch (error) {
        res.status(400).json({ status: 400, message: "Failed to create product" })
        console.log(error)
    }   
}

// ****************************** List all products **********************************
const getProducts = async (req, res) => {
    try {
        // Get pagination items query or set default values
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 10;
        const skip = (page - 1) * limit;
        const subcategoryName = req.query.subcategory_name || null;
        const active = req.query.active;

        // Define the match object for aggregation pipeline based on the active query
        const match = active === 'true' ? { active: true } : active === 'false' ? { active: false } : {};

        // Get all products with limit number per page and sort them by creation date.
        const products = await Product.aggregate([
            {
                $lookup: {
                    from: "subcategories",
                    localField: "subcategory_id",
                    foreignField: "_id",
                    as: "subcategory",
                },
            },
            {
                $unwind: "$subcategory",
            },
            {
                $project: {
                    _id: 1,
                    product_name: 1,
                    subcategory_id: "$subcategory._id",
                    subcategory_name: "$subcategory.subcategory_name",
                    product_images: { $arrayElemAt: ["$product_images", 0] },
                    price: 1,
                    active: 1,
                },
            },
            {
                $match: match, // Add the match stage to filter based on active status
            },
        ])
            .limit(limit).skip(skip).sort({ 'created_at': -1 });

        let count = products.length;

        // Check the existence of products for each page
        if (count < 1) {
            res.status(404).json({ status: 404, data: [] })
        } else {
            let result = [];

            // Filter by subcategoryName if provided
            if (subcategoryName) {
                result = products.filter(product => product.subcategory_name === subcategoryName);
                count = result.length;
            } else {
                result = products;
            }

            res.status(200).json({ status: 200, count, page, limit, products: result });
        }
    } catch (error) {
        res.status(400).json({ status: 400, message: "Failed to get products" });
    }
};

  
// ******************************* Get one product ***********************************
const getProduct = async (req, res) => {
    try {
        // Get product id from request params
        const productId = req.params.id; 

        // Get product by its ID
        const product = await Product.findById(productId);

        if (!product) {
            res.status(404).json({ status: 404, message: "Product not found" });
        } else {

            // Get subcategory name using aggregation
            const productWithSubcategory = await Product.aggregate([
                {
                    $match: { _id: product._id },
                },
                {
                    $lookup: {
                        from: "subcategories", 
                        localField: "subcategory_id",
                        foreignField: "_id",
                        as: "subcategory",
                    },
                },
                {
                    $unwind: "$subcategory",
                },
                {
                    $project: {
                        _id: 1,
                        product_name: 1,
                        subcategory_id:"$subcategory._id",
                        subcategory_name: "$subcategory.subcategory_name",
                        product_images: 1,
                        short_description: 1,
                        long_description: 1,
                        price: 1,
                        discount_price: 1,
                        active: 1,
                    },
                },
            ]);
            if (!productWithSubcategory || productWithSubcategory.length === 0) {
                res.status(500).json({ status: 500, error: "Failed to retrieve subcategory name" });
            } else {
                res.status(200).json({ status: 200, data: productWithSubcategory });
            }
        }
        
        res.status(200).json({status: 200, data : product})
    } catch (error) {
        res.status(404).json({status: 404, message: "Product not found"})
    }
};

// **************************** Search for a product *********************************
const searchProduct = async (req, res) => {
    try {
        // Get pagination items query or set default values
        const page = req.query.page *1 || 1
        const limit = req.query.limit *1 || 10
        const skip = (page - 1) * limit
        
        // Get search query and add regex
        const searchQuery = req.query.search_query; 
        const searchQueryRegex = new RegExp(searchQuery, 'i')

        // Get matching products by name or descriptions with limit number per page and sort them by name.
        const matchingProduct = await Product.aggregate([
            {
                $lookup: {
                  from: "subcategories", 
                  localField: "subcategory_id",
                  foreignField: "_id",
                  as: "subcategory",
                },
            },
            {
                $unwind: "$subcategory",
            },
            {
                $match: {
                    $or: [
                        { product_name: searchQueryRegex }, 
                        { short_description: searchQueryRegex },
                        { long_description: searchQueryRegex }
                    ],
                },
              },
              {
                $project: {
                    _id: 1,
                    product_name: 1,
                    subcategory_id:"$subcategory._id",
                    subcategory_name: "$subcategory.subcategory_name",
                    product_images: 1,
                    short_description: 1,
                    long_description: 1,
                    price: 1,
                    discount_price: 1,
                    active: 1,
                },
              },
            ]).limit(limit).skip(skip).sort({ 'product_name': -1 });
        const count = matchingProduct.length

        // Check product existence by it's Id
        if (count < 1) {
            return res.status(404).json({status: 404, message: "Product not found"})
        } else res.status(200).json({ status: 200, count, page, limit, data: matchingProduct })
    } catch (error) {
        res.status(400).json({status: 400, message: "Failed to get product"})
    }
};

// ******************************* Update product ************************************
const updateProduct = async (req, res) => {
    try {
        // Get product Id from request params
        const productId = req.params.id; 

        // Check product existence by it's Id
        const productExist = await Product.findOne({ _id: productId });
        if (!productExist) {
            return res.status(404).json({
                status: 404,
                message: "Product not found"
            })
        } else {
            // Get product data
            const { sku, product_name, short_description, long_description,
                 active, subcategory_id } = req.body;
            
            // Get images files
            const files = req.files;

            // Check if the new name and serialization are already exists except for the updated one
            const dataExist = await Product.findOne(
                {
                    $and: [
                        { $or: [{ product_name }, { sku }] },
                        { _id: { $ne: productId } }
                    ]
                }
            );
            if (dataExist) {
                return res.status(400).json({
                    status: 400,
                    message: "Product name or serialization already exists"
                })
            } else {
                // Store images in uploads folder
                files.forEach((file) => {
                    const filePath = `public/uploads/${file.filename}`;
                    fs.rename(file.path, filePath, (error) => {
                        if (error) return res.status(500).json({
                             status: 500,
                             message: 'Failed to store the images files'
                        })
                    })
                });
 
                // Check files existence and attach filenames to product_images
                const product_images = files.length > 0 ? files.map(file => file.filename) : productExist.product_images
 
                // Get the product price
                const price = req.body.price || productExist.price
 
                // Get the product discount_price
                const discount_price = req.body.discount_price || productExist.discount_price
             
                // Set current date to update_at
                const updatedAt = Date.now();
             
                // Find product by it's Id and update it
                await Product.findByIdAndUpdate(productId, {
                     sku, product_name, product_images, price, discount_price, short_description,
                     long_description,  active, updated_at: updatedAt, subcategory_id
                })
                res.status(200).json({ status: 200, message: "Product updated successfully" })
            }
        }
    } catch (error) {
        res.status(400).json({ status: 400, message: "Failed to update product" })
    }   
}

// ******************************* Delete product ************************************
const deleteProduct = async (req, res) => {
    try {
        // Get product Id from request params
        const productId = req.params.id;

        // Check existence of product
        const product = await Product.findById(productId);

        if (!product) {
            res.status(404).json({ status: 404, message: "Product not found" });
        } else {
            // Find product by it's Id and delete it
            await Product.findByIdAndDelete(productId);
            res.status(200).json({ status: 200, message: "Product deleted successfully" });
        }
    } catch (error) {
        res.status(400).json({ status: 400, message: "Failed to delete product" })
    }
};


module.exports = {createProduct, getProducts, searchProduct, getProduct, updateProduct, deleteProduct};
