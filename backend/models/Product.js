const mongoose = require('mongoose');

const file = new mongoose.Schema({
    filename: { type: String},
    id: { type: String},
    contentType: { type: String},
    length: { type: Number},
}, {timestamp: true});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, enum: ['male', 'female'], required: true },
  image: file, 
  sizes: [
    {
      volume: { type: String, enum: ['50ml', '100ml'] },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true } // Inventory count
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
