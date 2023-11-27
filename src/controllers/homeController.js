const router = require('express').Router();
const catalogService = require('../services/catalogService');

router.get('/', async (req, res) => {
    const lastAdded = await catalogService.getlastAdded().lean();

    res.render('home/home', { lastAdded });
});

router.get('/404', async (req, res) => {
    res.render('home/404');
});

module.exports = router;