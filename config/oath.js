module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    // req.flash('error_msg', 'Please login to acces this page');
    res.redirect('/login');
  }
}