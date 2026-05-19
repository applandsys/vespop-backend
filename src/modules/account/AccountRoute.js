const express = require('express');
const router = express.Router();
const AccountController = require('@/modules/account/AccountController');

// /account/
router.get('/profit', AccountController.getProfit);
router.post('/transaction', AccountController.addTransaction);
router.get('/transaction', AccountController.getTransaction);

/*
Add Sale Transaction
POST /account/transaction
{
  "particular": "Order #1023",
  "amount": 2500,
  "accountId": 1,
  "type": "credit",
  "source": "order"
}


Add Expense

POST /account/transaction
{
  "particular": "Courier Charge",
  "amount": 300,
  "accountId": 3,
  "type": "debit",
  "source": "expense"
}

 */


module.exports = router;