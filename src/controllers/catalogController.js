const router = require('express').Router();
const imgUpload = require('../middlewares/upload');
const catalogService = require('../services/catalogService');
const validation = require('../utils/validation');

router.get('/add', async (req, res) => {
    res.render('catalog/add');
});

router.post('/add', imgUpload, async (req, res) => {
    const ad = {
        type: req.body.type,
        location: req.body.location,
        price: req.body.price,
        area: req.body.area,
        floor: req.body.floor,
        phoneNumber: req.body.phoneNumber,
        info: req.body.info,
        views: 0
    };

    try {

        validation.validateAdData(ad, req.files);

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

    try {
        await catalogService.addView(adId);
        const ad = await catalogService.getOneDetailed(adId).lean();
        const isUser = req.user;
        const isAuthor = req.user?._id == ad.owner;
        const isNotAuthor = req.user?._id != ad.owner;
        const isInFavourites = ad.favourites.find(x => x._id == user?._id);

        res.render('catalog/details', { ad, isUser, isAuthor, isNotAuthor, isInFavourites });

    } catch (error) {
        res.render('home/404', { error });
    }
});

router.get('/search?', async (req, res) => {
    const { type, sort, price, area } = req.query;

    const ads = await catalogService.search(type, sort, price, area).lean();

    res.render('catalog/catalog', { ads });
});

router.get('/:adId/edit', async (req, res) => {
    const adId = req.params.adId;

    try {
        const ad = await catalogService.getOne(adId).lean();
        res.render('catalog/edit', { ad });
    } catch (error) {
        res.render('catalog/edit', { error });
    }
});

router.post('/:adId/edit', imgUpload, async (req, res) => {
    const adData = req.body;
    const newImgData = [];

    try {

        const currentAd = await catalogService.getOne(req.params.adId);

        if (req.files.mainImage) {
            const mainImgId = currentAd.images[0].public_id;
            await catalogService.deleteFromCloudinary(mainImgId);
            const mainImgData = await catalogService.uploadToCloudinary(req.files, 'properties');
            newImgData.push(mainImgData[0]);
        }

        await catalogService.edit(adData, newImgData, currentAd, req.params.adId);

        res.redirect(`/catalog/${req.params.adId}/details`);

    } catch (error) {
        res.render('catalog/edit', { adData, error });
    }
});

module.exports = router;