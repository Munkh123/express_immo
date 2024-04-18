module.exports = (req, res, next) => {
    if (!req.session.isAuth) {
        res.redirect("/connecter");
    }
    else if(!req.session.agent)
        res.redirect("/");
    else if(req.session.agent)
        next();
};
