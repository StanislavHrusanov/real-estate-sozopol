const router = require('express').Router();
const cloudinary = require('../config/cloudinary');

router.get('/add', async (req, res) => {
    res.render('catalog/add');
});

router.post('/add', async (req, res) => {
    
})

module.exports = router;