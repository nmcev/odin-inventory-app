var express = require('express');
var router = express.Router();

const home_controller = require('../controllers/homeController.js')
const item_controller = require('../controllers/itemsController')
const categories_Controller = require('../controllers/categoriesController')

router.get('/', home_controller.index);

// item routers
router.get('/items/create', item_controller.item_create_get)
router.post('/items/create', item_controller.item_create_post)

router.get('/items/update/:id', item_controller.item_update_get)
router.post('/items/update/:id', item_controller.item_update_post)

router.get('/items/:id/delete', item_controller.item_delete_get)
router.post('/items/:id/delete', item_controller.item_delete_post)

router.get('/items/:id', item_controller.item_detail)
router.get('/items', item_controller.item_list)

// category routers
router.get('/categories/create', categories_Controller.category_create_get)
router.post('/categories/create', categories_Controller.category_create_post)

router.get('/categories/update/:id', categories_Controller.category_update_get)
router.post('/categories/update/:id', categories_Controller.category_update_post)

router.get('/categories/:id/delete', categories_Controller.category_delete_get)
router.post('/categories/:id/delete', categories_Controller.category_delete_post)

router.get('/categories/:id', categories_Controller.category_detail)
router.get('/categories', categories_Controller.category_list)


module.exports = router;
