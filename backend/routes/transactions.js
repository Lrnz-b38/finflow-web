const express = require('express');
const Transaction = require('../models/Transaction');
const LinkedAccount = require('../models/LinkedAccount');
const auth = require('../middleware/auth');

const router = express.Router();

// Get transactions for all accounts or specific account
router.get('/', auth, async (req, res) => {
  try {
    const { accountId } = req.query;
    let filter = { userId: req.userId };

    if (accountId) {
      filter.linkedAccountId = accountId;
    }

    const transactions = await Transaction.find(filter)
      .populate('linkedAccountId')
      .sort({ date: -1 });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get transaction summary/dashboard
router.get('/summary', auth, async (req, res) => {
  try {
    const accounts = await LinkedAccount.find({ userId: req.userId });
    const transactions = await Transaction.find({ userId: req.userId });

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const totalSpent = transactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);

    res.json({
      totalAccounts: accounts.length,
      activeAccounts: accounts.filter(a => a.accountStatus === 'active').length,
      totalBalance,
      totalSpent,
      recentTransactions: transactions.slice(0, 10)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Record new transaction
router.post('/', auth, async (req, res) => {
  try {
    const { linkedAccountId, type, amount, description, merchant, category } = req.body;

    // Verify account belongs to user
    const account = await LinkedAccount.findOne({
      _id: linkedAccountId,
      userId: req.userId
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Create transaction
    const transaction = new Transaction({
      userId: req.userId,
      linkedAccountId,
      type,
      amount,
      description,
      merchant,
      category,
      currency: account.currency
    });

    await transaction.save();

    // Update account balance
    if (type === 'debit') {
      account.balance -= amount;
    } else if (type === 'credit') {
      account.balance += amount;
    }
    await account.save();

    res.status(201).json({
      message: 'Transaction recorded successfully',
      transaction
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
