import express from "express";
import passport from "passport";
const router= express.Router();

// @desc Auth with google
// @route GET /auth/google

router.get('/google', passport.authenticate('google',{ scope: ['profile']}))

// @desc Google Auth callback
// @route GET /auth/google/callback

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/'
    }), (req, res) => {
    res.redirect('/dashboard')
    }
);

// @desc  Logout user
// @route /auth/logout

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

export default router;