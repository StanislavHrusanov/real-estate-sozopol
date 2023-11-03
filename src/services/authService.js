const User = require('../models/User');
const bcrypt = require('bcrypt');
const { jwtSign } = require('../utils/jwtPromises');
const { SALT_ROUNDS, SECRET } = require('../config/env');

exports.createToken = (user) => {
    const payload = {
        _id: user._id,
        username: user.username,
        email: user.email
    }

    const options = { expiresIn: '2d' }


    return jwtSign(payload, SECRET, options);
}

exports.register = async ({ username, firstName, lastName, password, email }) => {

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const createdUser = User.create({
        username,
        firstName,
        lastName,
        password: hashedPassword,
        email
    });

    return createdUser;
}