const mongoose = require('mongoose');
const Schema = mongoose.Schema

const ItemSchema = new Schema({
    name: { type: String, require: true },
    descr: { type: String, require: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", require: true },
    price: { type: Number, require: true },
    inStock: { type: Number, require: true },
    imageUrl: { type: String, require: true }
})

ItemSchema.virtual('url').get(function () {
    return `/home/items/${this._id}`
})

const Item = mongoose.model("item", ItemSchema)
module.exports = Item