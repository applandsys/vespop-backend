const {insertSupportTicket, fetchSupportTicket} = require("@/modules/ecommerce/model/user/supportTicketModel");


const addSupportTicket =  async (req,res) => {
    const {subject,message,priority} = req.body;
    const {id}  = req.user;
    const ticket = await insertSupportTicket(id,subject,message,priority);
    res.json(ticket);
}

const getSupportTicket =  async (req,res) => {
    const {id}  = req.user;
    const ticket = await fetchSupportTicket(id);
    res.json(ticket);
}

module.exports = {
    addSupportTicket,
    getSupportTicket
};