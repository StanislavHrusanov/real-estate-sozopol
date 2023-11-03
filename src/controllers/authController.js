const router = require('express').Router();
const { SESSION_NAME } = require('../config/env');
const authService = require('../services/authService');


router.get('/register', async (req, res) => {
    res.render('auth/register');
});

router.post('/register', async (req, res) => {
    const userData = req.body;

    try {
        const createdUser = await authService.register(userData);

        const token = await authService.createToken(createdUser);

        res.cookie(SESSION_NAME, token, { httpOnly: true });
        res.redirect('/');
    } catch (error) {
        res.render('auth/register', { userData, error });
    }
});

router.get('/login', async (req, res) => {
    res.render('auth/login');
});

router.post('/login', async (req, res) => {
    const userData = req.body;

    try {
        const token = await authService.login(userData);

        res.cookie(SESSION_NAME, token, { httpOnly: true });
        res.redirect('/');

    } catch (error) {
        res.render('auth/login', { userData, error });
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie(SESSION_NAME);
    res.redirect('/');
});

module.exports = router;