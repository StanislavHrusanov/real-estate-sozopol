const routes = require('express').Router();
const homeController = require('./controllers/homeController');
const authController = require('./controllers/authController');
const catalogController = require('./controllers/catalogController');
const myProfileController = require('./controllers/myProfileController');

routes.use('/', homeController);
routes.use('/auth', authController);
routes.use('/catalog', catalogController);
routes.use('/myProfile', myProfileController);

module.exports = routes;