const router = require('express').Router();
const { SESSION_NAME } = require('../config/env');
const authService = require('../services/authService');


router.get('/register', async (req, res) => {
    res.render('auth/register');
});

router.post('/register', async (req, res) => {
    const userData = req.body;
    console.log(userData);
    try {
        const createdUser = await authService.register(userData);

        const token = await authService.createToken(createdUser);

        res.cookie(SESSION_NAME, token, { httpOnly: true });
        res.redirect('/');
    } catch (error) {
        console.log(error);
    }
});

router.get('/login', async (req, res) => {
    res.render('auth/login');
});

module.exports = router;