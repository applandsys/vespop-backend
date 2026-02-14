function sanitizeUser(customer) {
    const { password, ...safeCustomer } = customer;
    return safeCustomer;
}

module.exports = sanitizeUser;
