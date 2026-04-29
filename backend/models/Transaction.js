const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  linkedAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LinkedAccount',
    required: true
  },
  type: {
    type: String,
    enum: ['credit', 'debit', 'transfer'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: String,
  description: String,
  merchant: String,
  status: {
    type: String,
    enum: ['completed', 'pending', 'failed'],
    default: 'completed'
  },
  transactionId: String, // Third party transaction ID
  date: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    enum: ['food', 'transportation', 'shopping', 'utilities', 'entertainment', 'other'],
    default: 'other'
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
