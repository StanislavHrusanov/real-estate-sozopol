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
        info: req.body.info,
        views: 0
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

router.get('/:adId/details', async (req, res) => {
    const adId = req.params.adId;
    await catalogService.addView(adId);
    const ad = await catalogService.getOne(adId).lean();

    res.render('catalog/details', { ad });
});

router.get('/search?', async (req, res) => {
    const { type, sort, price, area } = req.query;

    const ads = await catalogService.search(type, sort, price, area).lean();

    res.render('catalog/catalog', { ads });
});

module.exports = router;