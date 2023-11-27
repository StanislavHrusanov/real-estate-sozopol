const Ad = require('../models/Ad');
const User = require('../models/User');

exports.getMyAds = (userId) => Ad.find({ owner: { $in: userId } });

exports.getUserDetails = (userId) => User.findById(userId).populate('favourites');