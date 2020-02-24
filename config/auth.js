module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg','Please Log in again')
        res.redirect('/users/login')
    }
}