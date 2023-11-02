const router = require('express').Router();

router.get('/register', async (req, res) => {
    res.render('auth/register');
});

module.exports = router;