require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {comparePasswordDb} = require("../../../utils/comparePasswordDb");
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

function sanitizeUser(customer) {
    const { password, ...safeCustomer } = customer;
    return safeCustomer;
}

/**
 *  CUSTOMER SIGNUP
 * @method POST
 * @param req
 * @param res
 * @returns {Promise<void>}
 */

const userLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find customer by email
        const user = await prisma.user.findUnique({ where: { email: email } });

        if (!user) {
            return res.status(401).json({ message: 'Invalid Email' });
        }

        // Compare password with hashed password in DB
        const isPasswordValid = await comparePasswordDb(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: '1h', // Token expiration time
        });

        // Send response with the token
        const sanitizedCustomer = sanitizeUser(user);
        res.json({ token, sanitizedCustomer });

    } catch (error) {
        console.error("Login error:", error);  // Log the detailed error
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const userSignup = async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword, address = "not given", gender, phone, sponsorId=null, side=null, uplineId=null } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        res.status(201).json({message: 'Account created successfully'});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Something went wrong', error: error.message});
    }

};


module.exports = {
    userSignup,
    userLogin,
};