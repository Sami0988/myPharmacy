const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Medicine name is required']
  },
  supplier:{
    type: String,
    required: [true, 'supplier name is required']
  },
  code: {
    type: String,
    unique: true,
    sparse: true 
  },
  batch: {
    type: String,
    required: [true, 'Batch number is required']
  },
  expiry_date: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  unit_of_measure: {
    type: String,
    required: [true, 'Unit of measure is required'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  unit_price: {
    type: Number,
    required: [true, 'Unit price is required'],
    min: [0, 'Price cannot be negative']
  },
  total_price: {
    type: Number,
    min: [0, 'Total price cannot be negative']
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


medicineSchema.pre('save', function(next) {
  if (this.quantity && this.unit_price) {
    this.total_price = parseFloat((this.quantity * this.unit_price).toFixed(2));
  }
  next();
});


medicineSchema.index({ name: 1 });
medicineSchema.index({ expiry_date: 1 });
medicineSchema.index({ batch: 1 });

module.exports = mongoose.model('Medicine', medicineSchema);