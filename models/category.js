const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CategorySchema = new Schema({
    name: { type: String, require: true },
    descr: { type: String, require: true },
})

CategorySchema.virtual('url').get(function () {
    return `/home/categories/${this._id}`
})

const Category = mongoose.model('Category', CategorySchema)
module.exports = Category