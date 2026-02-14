require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();
const sanitizeUser = require('../../../utils/senitizePassword');
const {comparePasswordDb} = require("../../../utils/comparePasswordDb");

/**
 *  CUSTOMER AUTHENTICATION
 * @method POST
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const JWT_SECRET = process.env.JWT_SECRET;

const customerAuth = async (req,res ) => {
    const { email, password } = req.body;

    try{
        const customer =  await prisma.customer.findUnique({where:{ email: email }}); // prosma = prismaClient

        if(!customer){
            return res.status(401).json({ status:"failed", message: 'Email Not Found' });
        }

        const isPasswordValid = await comparePasswordDb(password, customer.password);

        if(!isPasswordValid){
            return res.status(401).json({ status:"failed", message: 'Invalid Password' });
        }

        const token = jwt.sign({ id: customer.id, email: customer.email }, JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ token });
    }catch (error){
        res.status(500).json({ status:"failed", message: 'Server error' });
    }

    return [1,2,3];
}

const userInsert = async (req,res ) => {
    const { name, email, password } = req.body;
    const left_child_id = 0;
    const right_child_id = 0;
    const customer = await prisma.customer.create({ data: { name, email, password, left_child_id, right_child_id } });
    res.json(customer);
}

const userList =  async (req,res) => {
    const customer = await prisma.customer.findMany();
    res.json(customer);
}

// const userById = async (req, res) => {
//     const { [bannerId] } = req.params;
//     try {
//         const customer = await prisma.customer.findUnique({
//             where: { [bannerId]: parseInt([bannerId]) },
//         });
//
//         if (!customer) {
//             return res.status(404).json({ error: 'User not found' });
//         }
//
//         res.json(sanitizeUser(customer));
//     } catch (error) {
//         console.error('Error fetching user:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

/**
 *
 * @param id
 * @param visited
 * @returns {Promise<Omit<*, "password">|null>}
 *
 */
const getUserWithChildren = async (id, visited = new Set()) => {
    if (visited.has(id)) return null;
    visited.add(id);

    const customer = await prisma.customer.findFirst({
        where: { id: id }
    });

    if (!customer) return null;

    customer.left = customer.left_child_id
        ? await getUserWithChildren(customer.left_child_id, visited)
        : null;

    customer.right = customer.right_child_id
        ? await getUserWithChildren(customer.right_child_id, visited)
        : null;

    return sanitizeUser(customer);
};


const userTree = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const tree = await getUserWithChildren(id);
        res.json(tree);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch tree' });
    }
};




module.exports = {
    customerAuth,
    userInsert,
    userList,
  //  userById,
    userTree
};