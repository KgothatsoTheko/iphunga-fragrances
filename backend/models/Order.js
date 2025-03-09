const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  invoiceNumber: { type: String, unique: true }, // Auto-generated (e.g., INV-20231001-1234)
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  deliveryMethod: { type: String, enum: ['PAXI', 'Aramex'], required: true },
  pepStoreLocation: { type: String }, // If PAXI is chosen
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      volume: String, // "50ml" or "100ml"
      price: Number,
      quantity: Number
    }
  ],
  subtotal: { type: Number, required: true },
  deliveryCost: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Order Received', 'Being Packaged', 'Shipped'], 
    default: 'Order Received' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
