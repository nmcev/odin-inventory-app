const asyncHandler = require("express-async-handler");
const Category = require("../models/category")
const Item = require("../models/item")
const { body, validationResult } = require('express-validator')

exports.item_list = asyncHandler(async (req, res, next) => {
    const items = await Item.find().sort({ price: -1 }).exec()

    if (items === null) {
        const err = new Error('NO ITEMS')
        err.status = 404;
        return next(err)
    }

    res.render("item_list", {
        title: "All items",
        items_list: items,
        categoryName: 'none'
    })
})

exports.item_detail = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id).populate("category").exec()

    if (item === null) {
        const err = new Error("Item not found")
        err.status = 404
        return next(err)
    }

    res.render("item_detail", {
        title: "Item detail",
        item: item,
    })

})

exports.item_create_get = asyncHandler(async (req, res, next) => {
    const categories = await Category.find().sort({ name: 1 }).exec()
    res.render("item_form", {
        title: 'create an item',
        categories: categories
    })
})

exports.item_create_post = [
    body('name', "Name filed must not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Name must not be empty"),
    body('descr')
        .trim()
        .trim()
        .escape(),
    body('category')
        .trim()
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Category must not be empty"),
    body('price')
        .trim()
        .isNumeric()
        .withMessage("Price must be a number")
        .custom((value) => {
            if (parseFloat(value) < 0) {
                throw new Error('Price must not be less than 0');
            }
            return true;
        }),
    body('inStock')
        .trim()
        .isNumeric()
        .withMessage("quantity must be a number")
        .custom((value) => {
            if (parseFloat(value) < 0) {
                throw new Error('quantity must not be less than 0');
            }
            return true;
        }),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)
        const categories = await Category.find().exec()

        const item = new Item({
            name: req.body.name,
            descr: req.body.descr,
            category: req.body.category,
            price: req.body.price,
            inStock: req.body.inStock,
            imageUrl: req.body.imgUrl
        })

        if (!errors.isEmpty()) {
            res.render("item_form", {
                title: 'create an item',
                categories: categories,
                errors: errors.array()
            })
        } else {
            await item.save()
            res.redirect(item.url)
        }
    })
]

exports.item_delete_get = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id).exec()

    if (item === null) {
        const err = new Error("Item not found!")
        err.status = 404
        return next(err)
    }

    res.render('item_delete', {
        title: `Delete ${item.name}`
    })
})
exports.item_delete_post = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id).exec()
    const password = req.body.password;
    const correctPassword = process.env.PASSWORD;
    if (password !== correctPassword) {
        res.render('item_delete', {
            title: `Delete ${item.name}`,
            error: 'Incorrect password'
        })
        return;
    }

    await Item.findByIdAndDelete(req.params.id)
    res.redirect(`/home/categories/${item.category._id}`)
})

exports.item_update_get = asyncHandler(async (req, res, next) => {

    const [item, categories] = await Promise.all([
        Item.findById(req.params.id).exec(),
        Category.find().exec()
    ])


    if (item === null) {
        const err = new Error("Item not found!")
        err.status = 404;
        return next(err)
    }

    res.render("item_form", {
        title: `Updating ${item.name}`,
        item: item,
        categories: categories
    })
})

exports.item_update_post = [
    body('name', "Name filed must not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Name must not be empty"),
    body('descr')
        .trim()
        .trim()
        .escape(),
    body('category')
        .trim()
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Category must not be empty"),
    body('price')
        .trim()
        .isNumeric()
        .withMessage("Price must be a number")
        .custom((value) => {
            if (parseFloat(value) < 0) {
                throw new Error('Price must not be less than 0');
            }
            return true;
        }),
    body('inStock')
        .trim()
        .isNumeric()
        .withMessage("quantity must be a number")
        .custom((value) => {
            if (parseFloat(value) < 0) {
                throw new Error('quantity must not be less than 0');
            }
            return true;
        }),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const password = req.body.password;
        const categories = await Category.find().exec();

        const correctPassword = process.env.PASSWORD;
        if (password !== correctPassword) {
            errors.errors.push({ value: '', msg: 'Incorrect password', param: 'password', location: 'body' });
        }

        if (!errors.isEmpty()) {
            const item = await Item.findById(req.params.id).exec();

            res.render("item_form", {
                title: `Updating ${item.name}`,
                item: item,
                categories: categories,
                errors: errors.array()
            });
        } else {
            const itemUpdate = {
                name: req.body.name,
                descr: req.body.descr,
                category: req.body.category,
                price: req.body.price,
                inStock: req.body.inStock,
                imageUrl: req.body.imgUrl
            }

            await Item.findByIdAndUpdate(req.params.id, itemUpdate, {});

            res.redirect('/home/items/' + req.params.id);
        }
    })
]