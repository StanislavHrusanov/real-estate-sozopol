const Ad = require('../models/Ad');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const util = require('../utils/util');

exports.uploadToCloudinary = async (files, folder) => {
    const imagesData = [];

    const mainImgPath = files.mainImage[0].path;
    const mainImgData = await cloudinary.uploader.upload(mainImgPath, { folder });
    imagesData.push({ url: mainImgData.url, public_id: mainImgData.public_id });

    if (files.images) {
        for (const file of files.images) {
            const path = file.path;
            const data = await cloudinary.uploader.upload(path, { folder });
            imagesData.push({ url: data.url, public_id: data.public_id });
        }
    }

    return imagesData;
}

exports.deleteFromCloudinary = (imgId) => cloudinary.uploader.destroy(imgId);

exports.createAd = (ad) => Ad.create(ad);

exports.getlastAdded = () => Ad.find().sort({ createdAt: -1 }).limit(3);

exports.getOne = (id) => Ad.findById(id);

exports.getOneDetailed = (id) => Ad.findById(id).populate('favourites');

exports.addView = async (adId) => {
    const ad = await this.getOne(adId);
    if (!ad) {
        throw ('Not Found!')
    }
    ad.views += 1;
    await ad.save();
}

exports.search = (type, sort, price, area) => {
    let currPrice = Number(price);
    let currArea = Number(area);

    if (currPrice == '') {
        currPrice = Number.MAX_SAFE_INTEGER;
    }

    if (currArea == '') {
        currArea = Number.MIN_SAFE_INTEGER;
    }

    if (type == 'ВСИЧКИ') {
        return Ad.find({ price: { $lte: currPrice }, area: { $gte: currArea } }).sort(util.sortingCriteria[sort]);
    }

    return Ad.find({ type: type, price: { $lte: currPrice }, area: { $gte: currArea } }).sort(util.sortingCriteria[sort]);
}

exports.edit = async (adData, newImgData, currentAd, adId) => {

    if (newImgData.length > 0) {
        const images = currentAd.images;
        images.shift();
        images.unshift(newImgData[0]);
        adData.images = images;

    }
    return Ad.findByIdAndUpdate(adId, adData);
}

exports.delete = (adId) => Ad.findByIdAndDelete(adId);

exports.addToFavourites = async (adId, userId) => {

    const ad = await Ad.findById(adId).populate();
    const user = await User.findById(userId).populate();
    const isUserAdded = ad.favourites.find(x => x._id == userId);
    const isAdAdded = user.favourites.find(x => x._id == adId);

    if (!isUserAdded) {
        ad.favourites.push(userId);
        await ad.save();
    }

    if (!isAdAdded) {
        user.favourites.push(adId);
        await user.save();
    }
}

exports.removeFromFavourites = async (adId, userId) => {

    const ad = await Ad.findById(adId).populate();
    const user = await User.findById(userId).populate();
    const isUserAdded = ad.favourites.find(x => x._id == userId);
    const isAdAdded = user.favourites.find(x => x._id == adId);

    if (isUserAdded) {
        const indexOfUserId = ad.favourites.indexOf(userId);
        ad.favourites.splice(indexOfUserId, 1);
        await ad.save();
    }

    if (isAdAdded) {
        const indexOfAdId = user.favourites.indexOf(adId);
        user.favourites.splice(indexOfAdId, 1);
        await user.save();
    }
}