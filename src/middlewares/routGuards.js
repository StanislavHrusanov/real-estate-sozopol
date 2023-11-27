const catalogService = require('../services/catalogService');

exports.isOwner = async (req, res, next) => {
    const adId = req.params.adId;
    const ad = await catalogService.getOne(adId);

    if (req.user?._id != ad.owner) {
        return res.redirect('/404');
    }
    next();
}

exports.isNotOwner = async (req, res, next) => {
    const adId = req.params.adId;
    const ad = await catalogService.getOne(adId);

    if (req.user?._id == ad.owner) {
        return res.redirect('/404');
    }
    next();
}