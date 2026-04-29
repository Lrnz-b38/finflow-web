const mongoose = require('mongoose');

const linkedAccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  provider: {
    type: String,
    enum: ['PayPal', 'GCash', 'Maya', 'Stripe', 'Square', 'Other'],
    required: true
  },
  accountEmail: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    default: ''
  },
  balance: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  accountStatus: {
    type: String,
    enum: ['active', 'pending', 'inactive'],
    default: 'pending'
  },
  thirdPartyAgreement: {
    type: Boolean,
    default: false
  },
  thirdPartyAgreementDate: Date,
  accountId: String, // Third party account ID
  accessToken: String, // For API access (encrypted in production)
  refreshToken: String,
  linkedDate: {
    type: Date,
    default: Date.now
  },
  lastSynced: Date
});

module.exports = mongoose.model('LinkedAccount', linkedAccountSchema);
