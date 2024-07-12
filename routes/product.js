const express = require('express');
const router = express.Router();
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

const Farm = require('../models/farm');
const Product = require('../models/product');

const categories = ['fruit', 'vegetable', 'dairy', 'poultry'];


router.use((req,res,next) => {
    res.locals.messages = req.flash('success');
    next();
})

router.get('/', async (req,res) => {
    const{category} = req.query;
    if(category){
        const products = await Product.find({category});
        res.render('products/index', {products, category});
    } else{
        const products = await Product.find({});
        res.render('products/index', {products, category: 'All'});
    }
})

router.get('/new', catchAsync(async (req, res) => {
    const farms = await Farm.find({});
    if (!farms) throw new ExpressError('No Farms Available', 404);

    res.render('products/new',{categories,farms});
}));
router.post('/new', async (req,res) => {
    const {farm} = req.body;
    console.log(farm);
    if(!farm) throw new ExpressError('Product must have Farm', 400);
    const newProduct = new Product(req.body);
    farm.products.push(newProduct);// undefined prop cannot read
    await newProduct.save();
    await farm.save();
    res.redirect(`/products/${newProduct._id}`);
})

router.get('/:id', catchAsync(async (req,res) => {
    const {id} = req.params;
    const product = await Product.findById(id).populate('farm', 'name');
    if(!product) throw new ExpressError('Product Not Found',404);
    console.log(product);
    res.render('products/show',{product});
}))

router.put('/:id', async (req,res) => {
    const {id} = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
    res.redirect(`/products/${product._id}`);
})

router.delete('/:id', async (req,res) => {
    const {id} = req.params;
    const deletedproduct = await Product.findByIdAndDelete(id);
    res.redirect('/products');
})

router.get('/:id/edit', async (req,res) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    res.render('products/edit',{product, categories});
})

module.exports = router;