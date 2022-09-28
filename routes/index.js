import express from "express";
import middAuth from "../middleware/auth.js";
import Story from "../models/Story.js";
const router= express.Router();
const { ensureAuth, ensureGuest } = middAuth;
// @desc Login/Landing page
// @route GET /

router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    })
})

// @desc Dashboard
// @route GET /dashboard

router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ user: req.user.id }).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            stories
        }); 
    } catch (err) {
        console.error(err);
        res.render('error/500')
    }
    
});
export default router;