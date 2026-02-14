const bcrypt = require("bcrypt");
const comparePasswordDb = async (userPassword, dbPassword) => {
    return await bcrypt.compare(userPassword, dbPassword);
}

module.exports = {comparePasswordDb};