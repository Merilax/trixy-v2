const router = require('express').Router();

function isAuthorized(req, res, next) {
    if (req.user) { next(); }
    else { res.redirect('/'); }
}

router.get('/', isAuthorized, (req, res) => {
    res.render('dashboard/dashboard.ejs', {
        discordId: req.user.discordId,
        username: req.user.username,
        useravatar: req.user.useravatar
    });
});

module.exports = router;