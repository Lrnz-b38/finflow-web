const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Mock AI Chatbot responses
const chatbotResponses = {
  'balance': 'I can help you check your account balances. Use the dashboard to view all your linked accounts and their current balances.',
  'transaction': 'To view your transactions, go to the Transactions section where you can see all your recent activities across all linked accounts.',
  'link account': 'To link a new account, go to the Accounts section and click "Link New Account". Follow the verification process.',
  'payment': 'You can make payments by selecting the account you want to use from your linked accounts in the Payment section.',
  'help': 'I\'m here to help! You can ask me about:\n- Checking balances\n- Viewing transactions\n- Linking accounts\n- Making payments\n- And more!',
  'account': 'I can help you manage your linked accounts. What would you like to know about your accounts?'
};

// Send message to chatbot
router.post('/message', auth, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const lowerMessage = message.toLowerCase();
    
    // Find matching response (simple keyword matching for demo)
    let botResponse = 'I\'m not sure I understand that. Can you ask me about your accounts, balances, transactions, or payments?';
    
    for (const [keyword, response] of Object.entries(chatbotResponses)) {
      if (lowerMessage.includes(keyword)) {
        botResponse = response;
        break;
      }
    }

    res.json({
      userMessage: message,
      botResponse,
      timestamp: new Date()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
