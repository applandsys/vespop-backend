require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const existInObject = require("../../../utils/existInObject");
const {getCustomerById, getCustomerByUiId} = require("../../../services/customers/getCustomer");


const getCurrentMonth = require("../../../utils/getCurrentMonth");
const getTodayDateYYYYMMDD = require("../../../utils/getTodayDateYYYYMMDD");
const getLastUser = require("../../auth/model/userModel");

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

const customerSignup = async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword, address = "not given", gender, phone, sponsorId=null} = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const lastUser = await getLastUser();
        const todayDate = getTodayDateYYYYMMDD();
        const uid = lastUser ? todayDate + lastUser.id : todayDate;

        const existingUser = await prisma.customer.findUnique({where: {email}});

        if (existingUser) {
            return res.status(400).json({message: 'Customer using same Email already exists'});
        }

          await prisma.customer.create({
            data: {
                uid: parseInt(uid),
                first_name: firstName,
                last_name: lastName,
                email,
                password: hashedPassword,
                gender,
                phone,
                sponsor_id: sponsorId ? parseInt(sponsorId) : null,
            },
        });


        res.status(201).json({message: 'Account created successfully'});
    } catch (error) {
        res.status(500).json({message: 'Something went wrong', error: error.message});
    }

};


const JWT_SECRET = process.env.JWT_SECRET;

const customerLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find customer by email
        const customer = await prisma.customer.findUnique({ where: { email: email } });

        if (!customer) {
            return res.status(401).json({ message: 'Invalid Email' });
        }

        // Compare password with hashed password in DB
        const isPasswordValid = await bcrypt.compare(password, customer.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: customer.id, email: customer.email }, JWT_SECRET, {
            expiresIn: '1h', // Token expiration time
        });

        // Send response with the token
        const sanitizedCustomer = sanitizeUser(customer);
        res.json({ token, sanitizedCustomer });

    } catch (error) {
        console.error("Login error:", error);  // Log the detailed error
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}


const customerById = async (req, res) => {
    const { id } = req.params;
    try {
        const customer = await prisma.customer.findUnique({
            where: { id: parseInt(id) },
        });

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        res.json(sanitizeUser(customer));
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    customerSignup,
    customerLogin,
    customerById
};