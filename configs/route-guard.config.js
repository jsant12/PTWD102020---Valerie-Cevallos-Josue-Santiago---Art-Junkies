module.exports = (req, res, next) => {
  // if user is logged in and authenticated, allow access (view) to page
  if (req.session.currentUser) next();
  // in user is not logged in, prompt user for login info and then allow them to view page
  else res.redirect("/auth/login");
};