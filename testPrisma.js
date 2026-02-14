const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.customer.findMany();
    console.log(users);
}
main().catch(e => {
    console.error(e);
});
