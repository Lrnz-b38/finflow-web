const express = require('express');
const LinkedAccount = require('../models/LinkedAccount');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all linked accounts for user
router.get('/', auth, async (req, res) => {
  try {
    const accounts = await LinkedAccount.find({ userId: req.userId }).sort({ linkedDate: -1 });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single account
router.get('/:accountId', auth, async (req, res) => {
  try {
    const account = await LinkedAccount.findOne({
      _id: req.params.accountId,
      userId: req.userId
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json(account);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Link new account (initiate binding process)
router.post('/link', auth, async (req, res) => {
  try {
    const { provider, accountEmail } = req.body;

    if (!provider || !accountEmail) {
      return res.status(400).json({ error: 'Provider and account email are required' });
    }

    // Check if account already linked
    const existingAccount = await LinkedAccount.findOne({
      userId: req.userId,
      provider,
      accountEmail
    });

    if (existingAccount) {
      return res.status(400).json({ error: 'This account is already linked' });
    }

    // Create new linked account (pending third-party agreement)
    const linkedAccount = new LinkedAccount({
      userId: req.userId,
      provider,
      accountEmail,
      accountStatus: 'pending',
      balance: Math.floor(Math.random() * 5000) + 100 // Mock balance
    });

    await linkedAccount.save();

    res.status(201).json({
      message: 'Account linking initiated. Please verify third-party agreement.',
      account: linkedAccount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify third-party agreement and activate account
router.post('/:accountId/verify-agreement', auth, async (req, res) => {
  try {
    const { agree } = req.body;

    const account = await LinkedAccount.findOne({
      _id: req.params.accountId,
      userId: req.userId
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    if (!agree) {
      return res.status(400).json({ error: 'Third-party agreement must be accepted' });
    }

    account.thirdPartyAgreement = true;
    account.thirdPartyAgreementDate = new Date();
    account.accountStatus = 'active';
    account.lastSynced = new Date();

    await account.save();

    res.json({
      message: 'Account successfully linked and activated',
      account
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update account nickname
router.put('/:accountId/nickname', auth, async (req, res) => {
  try {
    const { nickname } = req.body;

    const account = await LinkedAccount.findOneAndUpdate(
      { _id: req.params.accountId, userId: req.userId },
      { nickname },
      { new: true }
    );

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json({
      message: 'Nickname updated successfully',
      account
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Unlink account
router.delete('/:accountId', auth, async (req, res) => {
  try {
    const account = await LinkedAccount.findOneAndDelete({
      _id: req.params.accountId,
      userId: req.userId
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json({
      message: 'Account unlinked successfully'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
