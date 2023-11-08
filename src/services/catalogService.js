const Ad = require('../models/Ad');
const cloudinary = require('../config/cloudinary');

exports.uploadToCloudinary = async (files, folder) => {
    const imagesData = [];

    for (const file of files) {
        const path = file.path;
        const data = await cloudinary.uploader.upload(path, { folder });
        imagesData.push({ url: data.url, public_id: data.public_id });
    }

    return imagesData;
}

exports.createAd = (ad) => Ad.create(ad);