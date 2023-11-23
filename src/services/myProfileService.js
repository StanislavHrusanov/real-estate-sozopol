const Ad = require('../models/Ad');

exports.getMyAds = (userId) => Ad.find({ owner: { $in: userId } });