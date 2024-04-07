const asyncHandler = require("express-async-handler");
const Category = require("../models/category")
const Items = require("../models/item")

exports.category_list = asyncHandler(async (req, res, next) => {
    const categories = await Category.find().sort({ name: -1 }).exec()

    res.render("category_list", {
        title: "Categories list",
        categories_list: categories
    })
})

exports.category_detail = asyncHandler(async (req, res, next) => {
    const items = await Items.find({ category: req.params.id }).exec()
    if (items === null) {
        const err = new Error("Category not found")
        err.status = 404
        return next(err)
    }

    res.render("item_list", {
        title: "Category items",
        items_list: items
    })
})

exports.category_create_get = asyncHandler(async (req, res, next) => {
    res.send("Category create: Not implemented yet")
})

exports.category_create_post = asyncHandler(async (req, res, next) => {
    res.send("Category create: Not implemented yet")
})

exports.category_delete_get = asyncHandler(async (req, res, next) => {
    res.send("Category delete: Not implemented yet")
})

exports.category_delete_post = asyncHandler(async (req, res, next) => {
    res.send("Category delete: Not implemented yet")
})