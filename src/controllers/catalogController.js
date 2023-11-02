const router = require('express').Router();

router.get('/add', async (req, res) => {
    res.render('catalog/add');
});

module.exports = router;