const express = require('express');
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose')
const app = express();

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

//Routes
app.use('/', require('./routes/index'));

app.use('/users', require('./routes/users'));

const PORT =  process.env.PORT || 5000;

app.listen(PORT, console.log(`Server Started At port ${PORT}`));
