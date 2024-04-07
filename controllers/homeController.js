const asyncHandler = require("express-async-handler");
const Category = require('../models/category');
const Item = require('../models/item');

exports.index = asyncHandler(async (req, res, next) => {
    const [categories, items] = await Promise.all([
        Category.countDocuments().exec(),
        Item.countDocuments().exec()
    ]);
    res.render('index', { title: 'Inventory Home', categories_count: categories, items_count: items });
});
