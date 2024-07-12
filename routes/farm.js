const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const Farm = require('../models/farm');
const Product = require('../models/product');

const categories = ['fruit', 'vegetable', 'dairy', 'poultry'];


router.use((req,res,next) => {
    res.locals.messages = req.flash('success');
    next();
})

router.get('/', catchAsync(async (req,res) => {
    const farms = await Farm.find({});
    if(farms.length === 0) throw new ExpressError('Sorry, No Farms Available!', 500);
    res.render('farms/index', {farms});// Looking for msg with key success in req.flash ---> options:  messages: req.flash('success')
}))

router.get('/new', (req,res) => {
    res.render('farms/new');
})
router.post('/new', catchAsync(async (req,res) => {
    const farm = new Farm(req.body);
    if(!farm) throw new ExpressError('Farm Not Found', 404);
    await farm.save();
    req.flash('success', 'Successfully made a Farm!!');
    res.redirect('/farms')
}))

router.get('/:id', catchAsync(async (req,res) => {
    const farm = await Farm.findById(req.params.id).populate('products');
    if(!farm) throw new ExpressError('Farm Not Found', 404);
    res.render('farms/show', {farm});
}))
router.put('/:id', catchAsync(async (req,res) => {
    const farm = await Farm.findByIdAndUpdate(req.params.id, req.body);
    if(!farm) throw new ExpressError('Farm Not Found', 404);
    req.flash('success', 'Successfully saved changes!!');
    res.redirect(`/farms/${farm._id}`);
}))
router.delete('/:id', catchAsync(async (req,res) => {
    const deleted = await Farm.findByIdAndDelete(req.params.id);
    if(!deleted) throw new ExpressError('Farm Not Found', 404);
    req.flash('success', 'Successfully deleted the Farm!');
    res.redirect('/farms');
}))

router.get('/:id/edit', catchAsync(async (req,res) => {
    const farm = await Farm.findById(req.params.id);
    if(!farm) throw new ExpressError('Farm Not Found', 404);
    res.render('farms/edit',{farm});
}))

router.get('/:id/product/new', catchAsync(async (req,res) => {
    const farm = await Farm.findById(req.params.id);
    if(!farm) throw new ExpressError('Farm Not Found', 404);
    res.render('farms/product',{farm, categories});
}))
router.post('/:id/products/new', catchAsync(async (req,res) => {
    const farm = await Farm.findById(req.params.id);
    if(!farm) throw new ExpressError('Farm Not Found', 404);

    const product = new Product(req.body);
    farm.products.push(product);
    product.farm = farm;
    await farm.save();
    await product.save();

    res.redirect(`/farms/${req.params.id}`);
}))

module.exports = router;