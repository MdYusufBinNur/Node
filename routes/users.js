const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth');

router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));
router.post('/register',(req, res) => {
    const { name, email,password, password2 } = req.body;
    let errors = [];

    if (!name || !email || !password || !password2){
        errors.push({msg: 'Please fill all fields'});
    }

    if (password !== password2){
        errors.push({ msg: "Password don't match"});
    }
    if (errors.length > 0){
        res.render('register', {
            errors, name, email, password, password2
        })
    }else {
        User.findOne({ email: email})
            .then(user => {
                if (user){
                    errors.push({ msg: 'Email already taken'});
                    res.render('register', {
                        errors, name, email, password, password2
                    })
                }else {
                    const newUser = new User({name, email, password});
                    bcrypt.genSalt(10,(err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash)=>{
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg','You are registered');
                                    res.redirect('/users/login')
                                })
                                .catch(err =>console.log(err))
                        }))

                }
            })
    }
});

// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Logout
router.get('/logout', (req, res, next) => {
    req.logout();
    req.flash('success_msg','Successfully logged out');
    res.redirect('/users/login')
})

module.exports = router;
