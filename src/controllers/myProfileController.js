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

module.exports = router;