const asyncHandler = require("express-async-handler");
const Category = require("../models/category")
const Item = require("../models/item")

exports.item_list = asyncHandler(async (req, res, next) => {
    const items = await Item.find().sort({price: -1}).exec()

    if (items === null) {
        const err = new Error('NO ITEMS')
        err.status = 404;
        return next(err)
    }

    res.render("item_list", {
        title: "All items",
        items_list: items
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
    res.send("Items create: Not implemented yet")
})

exports.item_create_post = asyncHandler(async (req, res, next) => {
    res.send("Items list: Not implemented yet")
})

exports.item_delete_get = asyncHandler(async (req, res, next) => {
    res.send("Items delete: Not implemented yet")
})
exports.item_delete_post = asyncHandler(async (req, res, next) => {
    res.send("Items list: Not implemented yet")
})