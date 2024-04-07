#! /usr/bin/env node
const { debug } = require('console')


// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Item = require("./models/item");
const Category = require('./models/category')

const items = []
const categories = []

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => debug(err));

async function main() {
    debug("Debug: About to connect");
    await mongoose.connect(mongoDB);
    debug("Debug: Should be connected?");
    await createCategory()
    await createItem()
    debug("Debug: Closing mongoose");
    mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.


async function itemCreate(index, name, descr, cate, price, inStock, imgUrl) {
    const itemDetail = {
        name: name,
        descr: descr,
        category: cate,
        price: price,
        inStock: inStock,
        imageUrl: imgUrl
    }
    const item = new Item(itemDetail)
    await item.save();
    items[index] = item
    debug(`Added Item: ${name}`)
}

async function categoryCreate(index, name, descr) {
    const categoryDetail = { name: name, descr: descr }
    const category = new Category(categoryDetail)

    await category.save();
    categories[index] = category
    debug(`Added Category: ${name}`)
}


async function createItem() {
    debug("Adding items")
    await Promise.all([
        await itemCreate(0, "PS5", "The best console in the market", categories[0], 500, 10, "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBzNXxlbnwwfHwwfHx8MA%3D%3D"),
        await itemCreate(1, "Xbox", "Xbox which is the worst", categories[0], 299, 10, "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8eGJveHxlbnwwfHwwfHx8MA%3D%3D"),
        await itemCreate(2, "PS4", "The old generation", categories[0], 250, 14, "https://images.unsplash.com/photo-1507457379470-08b800bebc67?q=80&w=300&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
        await itemCreate(6, "GTA V", "The best open world game", categories[1], 60, 20, "https://media.rockstargames.com/rockstargames/img/global/news/upload/actual_1364906194.jpg"),
        await itemCreate(7, "Red Dead Redemption", "The best western game", categories[1], 60, 20, "https://assets.vg247.com/current//2018/05/red_dead_redemption_2_cover_art_1.jpg"),
        await itemCreate(8, "FC 24", "The best football game", categories[1], 60, 20, "https://www.fifplay.com/img/public/fc-24-cover-standard-edition.jpg"),
        await itemCreate(8, "Ps5 Controller", "The best controller", categories[2], 60, 20, "https://images.unsplash.com/photo-1670535788315-6b7d64aa020c?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHBzNSUyMGNvbnRyb2xsZXJ8ZW58MHx8MHx8fDA%3D"),
        await itemCreate(9, "Headset", "The best headset", categories[2], 60, 20, "https://images.unsplash.com/photo-1579065560489-989b0cc394ce?q=80&w=305&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
    ]);
}


async function createCategory() {
    debug("Adding Categories")
    await Promise.all([
        // pass all categories that will be populate the db
        // pass game store information
        await categoryCreate(0, "Consoles", "All the consoles you need"),
        await categoryCreate(1, "Games", "The best games in the market"),
        await categoryCreate(2, "Accessories", "Accessories for all your gaming needs"),

    ])
}

