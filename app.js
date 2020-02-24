const express = require('express');
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose')
const app = express();
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
//Passport Config
require('./config/passport')(passport);


//Mongo Db
const db = require('./config/keys').MongoURI;

//Mongo Db Connect
mongoose.connect(db, { useNewUrlParser: true,  useUnifiedTopology: true })
    .then(() => console.log('Mongo Connected...'))
    .catch(err => console.log(err));

//EJS
app.use(expressLayout);
app.set('view engine', 'ejs');

//BodyParser
app.use(express.urlencoded({ extend: false}));

//Express-Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,

}));
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();

});


//Routes
app.use('/', require('./routes/index'));

app.use('/users', require('./routes/users'));

const PORT =  process.env.PORT || 5000;

app.listen(PORT, console.log(`Server Started At port ${PORT}`));
