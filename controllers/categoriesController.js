const asyncHandler = require("express-async-handler");
const Category = require("../models/category")
const Items = require("../models/item")
const { body, validationResult } = require('express-validator');
const Item = require("../models/item");

exports.category_list = asyncHandler(async (req, res, next) => {
    const categories = await Category.find().sort({ name: -1 }).exec()

    res.render("category_list", {
        title: "Categories list",
        categories_list: categories
    })
})

exports.category_detail = asyncHandler(async (req, res, next) => {
    const items = await Items.find({ category: req.params.id }).exec()
    const categoryName = await Category.findById(req.params.id, { name: 1 }).exec()
    const categoryId = req.params.id
    if (items === null) {
        const err = new Error("Category not found")
        err.status = 404
        return next(err)
    }

    res.render("item_list", {
        title: "Category items",
        items_list: items,
        categoryId: categoryId,
        categoryName: categoryName
    })
})

exports.category_create_get = asyncHandler(async (req, res, next) => {
    res.send("Category create: Not implemented yet")
})

exports.category_create_post = asyncHandler(async (req, res, next) => {
    res.send("Category create: Not implemented yet")
})

exports.category_delete_get = asyncHandler(async (req, res, next) => {
    const categoryItems = await Item.find({ category: req.params.id }).exec()

    if (categoryItems === null) {
        res.redirect('/home/categories')
        return;
    }

    res.render('category_delete', {
        title: 'Deleting a category',
        items_list: categoryItems
    })
})

exports.category_delete_post = asyncHandler(async (req, res, next) => {
    await Category.findByIdAndDelete(req.params.id)
    res.redirect('/home/categories')

})

exports.category_update_get = asyncHandler(async (req, res, next) => {

    const categoryName = await Category.findById(req.params.id, { name: 1 }).exec();

    if (categoryName === null) {
        const err = new Error("There is no category name")
        err.status = 404;
        return next(err)
    }

    res.render('category_form', {
        title: "Update a category",
        category: categoryName
    })
})

exports.category_update_post = [
    body('name')
        .trim()
        .isLength({ min: 3 })
        .escape()
        .withMessage("Name must be at least 3 characters")
    , asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)

        const category = new Category({
            name: req.body.name,
            _id: req.params.id
        })

        if (!errors.isEmpty()) {
            res.render('category_form', {
                title: "Update a category",
                category: category,
                errors: errors.array()
            })
        } else {
            await Category.findByIdAndUpdate(req.params.id, category, {})
            res.redirect(category.url)
        }
    })
]