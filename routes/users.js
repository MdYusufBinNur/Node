const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const bycrypt = require('bcryptjs');

router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));
router.post('/register',(req, res) => {
    const { name, email,password, password2} = req.body;
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
                    res.render('login')
                }
            })

    }
});
module.exports = router;
