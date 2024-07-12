const mongoose = require('mongoose');
const {Schema} = mongoose;

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0
    },
    category: {
        type: String,
        lowercase: [true, 'Categoroy is required'],
        enum: ['fruit', 'vegetable', 'dairy', 'poultry']
    }, 
    imageURL: {
        type: String,
        default: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/495px-No-Image-Placeholder.svg.png?20200912122019'
    }, 
    description: {
        type: String,
        default: 'No description available'
    } ,
    farm: {
        type: Schema.Types.ObjectId,
        ref: 'Farm'
    }
})

const Product = mongoose.model('Product', productSchema); // Compiling our schema into a model

module.exports = Product;