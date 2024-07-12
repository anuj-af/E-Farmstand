const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');

const farms = require('./routes/farm');
const products = require('./routes/product');

app.engine('ejs', ejsMate);
app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true})); //Important for parsing data to req.body otherwise it'll be undefined
app.use(methodOverride('_method'));
const sessionOption = {secret: 'thisisnotagoodsecret', resave: false, saveUninitialized: false};
app.use(session(sessionOption));
app.use(flash());

app.use('/farms',farms);
app.use('/products', products);

mongoose.connect('mongodb://127.0.0.1:27017/farmStand')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!");
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!");
        console.log(err);
    })


app.get('/', (req,res) => {
    res.redirect('/farms');
})

app.use((err,req,res,next) => {
    console.log("Error handler called")
    const { status = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(status).send(err.message);
})

app.listen(3000, () => {
    console.log("API IS LISTENING ON PORT 3000");
})