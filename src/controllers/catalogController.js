const router = require('express').Router();
const { isLoggedIn } = require('../middlewares/authMiddleware');
const { isOwner, isNotOwner } = require('../middlewares/routGuards');
const imgUpload = require('../middlewares/upload');
const catalogService = require('../services/catalogService');
const validation = require('../utils/validation');

router.get('/add', isLoggedIn, async (req, res) => {
    res.render('catalog/add');
});

router.post('/add', isLoggedIn, imgUpload, async (req, res) => {
    const ad = req.body;

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
        const isInFavourites = ad.favourites.find(x => x._id == req.user?._id);

        res.render('catalog/details', { ad, isUser, isAuthor, isNotAuthor, isInFavourites });

    } catch (error) {
        res.render('home/404', { error });
    }
});

router.get('/search?', async (req, res) => {
    const { type, sort, price, area } = req.query;

    const ads = await catalogService.search(type, sort, price, area).lean();

    res.render('catalog/catalog', { ads, type });
});

router.get('/:adId/edit', isLoggedIn, isOwner, async (req, res) => {
    const adId = req.params.adId;

    try {
        const ad = await catalogService.getOne(adId).lean();
        res.render('catalog/edit', { ad });
    } catch (error) {
        res.render('catalog/edit', { error });
    }
});

router.post('/:adId/edit', isLoggedIn, isOwner, imgUpload, async (req, res) => {
    const ad = req.body;
    const newImgData = [];

    try {
        validation.validateEditedData(ad, req.files);

        const currentAd = await catalogService.getOne(req.params.adId);

        if (req.files.mainImage) {
            const mainImgId = currentAd.images[0].public_id;
            await catalogService.deleteFromCloudinary(mainImgId);
            const mainImgData = await catalogService.uploadToCloudinary(req.files, 'properties');
            newImgData.push(mainImgData[0]);
        }

        await catalogService.edit(ad, newImgData, currentAd, req.params.adId);

        res.redirect(`/catalog/${req.params.adId}/details`);

    } catch (error) {
        res.render('catalog/edit', { ad, error });
    }
});

router.get('/:adId/delete', isLoggedIn, isOwner, async (req, res) => {
    const adId = req.params.adId;

    try {
        await catalogService.delete(adId);
        res.redirect('/');
    } catch (error) {
        res.render('home/404', { error });
    }
});

router.get('/:adId/addToFavourites', isLoggedIn, isNotOwner, async (req, res) => {
    const adId = req.params.adId;
    const userId = req.user._id;

    try {
        await catalogService.addToFavourites(adId, userId);
        res.redirect(`/catalog/${adId}/details`);
    } catch (error) {
        res.render('home/404', { error });
    }
});

router.get('/:adId/removeFromFavourites', isLoggedIn, isNotOwner, async (req, res) => {
    const adId = req.params.adId;
    const userId = req.user._id;

    try {
        await catalogService.removeFromFavourites(adId, userId);
        res.redirect(`/catalog/${adId}/details`);
    } catch (error) {
        res.render('home/404', { error });
    }
});

module.exports = router;