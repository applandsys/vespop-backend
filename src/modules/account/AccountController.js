const {
    calculateProfit,
    insertTransaction,
    fetchTransactions,
} = require("@/modules/account/AccountModel.js");

const getProfit = async (req, res) => {
    try {
        const result = await calculateProfit();
        res.json({ success: true, data: result });
    } catch (e) {
        res.status(500).json({ success: false, message: "Profit error" });
    }
};

const addTransaction = async (req, res) => {
    try {
        const trx = await insertTransaction(req.body);
        res.status(201).json({ success: true, data: trx });
    } catch (e) {
        res.status(500).json({ success: false, message: "Transaction failed" });
    }
};

const getTransaction = async (req, res) => {
    const trx = await fetchTransactions();
    res.json({ success: true, data: trx });
};

module.exports = {
    getProfit,
    addTransaction,
    getTransaction,
};