const router = require('express').Router();
const cloudinary = require('../config/cloudinary');
const imgUpload = require('../middlewares/upload');
const catalogService = require('../services/catalogService');

router.get('/add', async (req, res) => {
    res.render('catalog/add');
});

router.post('/add', imgUpload, async (req, res) => {

    const ad = {
        type: req.body.type,
        location: req.body.location,
        price: Number(req.body.price),
        area: Number(req.body.area),
        floor: req.body.floor,
        phoneNumber: req.body.phoneNumber,
        info: req.body.info
    };

    try {
        const imagesData = await catalogService.uploadToCloudinary(req.files, 'properties');
        ad.images = imagesData;
        ad.owner = req.user._id;
        await catalogService.createAd(ad);
        res.redirect('/');

    } catch (error) {
        res.render('catalog/add', { ad, error });
    }

});

module.exports = router;