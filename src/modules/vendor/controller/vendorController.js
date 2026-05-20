const {getVendorList} = require("../model/vendorModel");

function sanitizeUser(customer) {
    const { password, ...safeCustomer } = customer;
    return safeCustomer;
}
const vendorList = async (req,res) => {
    const allVendor = await getVendorList();
    res.status(200).json(allVendor);
}

module.exports = {
    vendorList,
};