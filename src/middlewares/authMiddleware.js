const { jwtVerify } = require('../utils/jwtPromises');
const { SESSION_NAME, SECRET } = require('../config/env');

exports.auth = async (req, res, next) => {
    const token = req.cookies[SESSION_NAME];

    if (token) {
        try {
            const verifiedToken = await jwtVerify(token, SECRET);

            req.user = verifiedToken;
            res.locals.user = verifiedToken;

        } catch (error) {
            res.clearCookie(SESSION_NAME);
            return res.redirect('/auth/login');
        }
    }
    next();
}