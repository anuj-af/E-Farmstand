const mongoose = require('mongoose');
const Prooduct = require('./product'); 
const Product = require('./product');
const {Schema} = mongoose;

const farmSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Farm must have a name']
    },
    city: {
        type: String,
    },
    email: {
        type: String,
        required: [true, 'Email required']
    },
    imageURL: {
        type: String,
        default: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/495px-No-Image-Placeholder.svg.png?20200912122019' 
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }]
})

// farmSchema.pre('findOneAndDelete', async function(data) {
//     console.log('Pre Middleware');
//     console.log(data);
// })


// Define before compiling model
farmSchema.post('findOneAndDelete', async function(farm) {
    if(farm.products.length){
        const res = await Product.deleteMany({_id: {$in: farm.products}});//delete all products having ids in products array that farm contains
        console.log(res);
    }
})

const Farm = mongoose.model('Farm',farmSchema);

module.exports = Farm;