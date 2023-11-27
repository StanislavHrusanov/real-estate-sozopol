const router = require('express').Router();
const myProfileService = require('../services/myProfileService');

router.get('/myAds', async (req, res) => {
    try {
        const myAds = await myProfileService.getMyAds(req.user._id).lean();
        res.render('myProfile/myAds', { myAds });
    } catch (error) {
        res.render('home/404', { error })
    }
});

router.get('/myFavourites', async (req, res) => {
    try {
        const userDetails = await myProfileService.getUserDetails(req.user._id).lean();
        const myFavourites = userDetails.favourites;
        res.render('myProfile/myFavourites', { myFavourites });
    } catch (error) {
        res.render('home/404', { error })
    }
});

module.exports = router;