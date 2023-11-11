const Ad = require('../models/Ad');
const cloudinary = require('../config/cloudinary');

exports.uploadToCloudinary = async (files, folder) => {
    const imagesData = [];

    const mainImgPath = files.mainImage[0].path;
    const mainImgData = await cloudinary.uploader.upload(mainImgPath, { folder });
    imagesData.push({ url: mainImgData.url, public_id: mainImgData.public_id });

    if (files.images.length > 0) {
        for (const file of files.images) {
            const path = file.path;
            const data = await cloudinary.uploader.upload(path, { folder });
            imagesData.push({ url: data.url, public_id: data.public_id });
        }
    }

    return imagesData;
}

exports.createAd = (ad) => Ad.create(ad);

exports.getlastAdded = () => Ad.find().sort({ createdAt: -1 }).limit(3);

exports.getOne = (id) => Ad.findById(id);

exports.addView = async (adId) => {
    const ad = await this.getOne(adId);

    ad.views += 1;
    await ad.save();
}