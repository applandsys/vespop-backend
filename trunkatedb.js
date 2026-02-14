const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function dropAllTables() {
    try {
        // 1️⃣ Drop schema
        await prisma.$executeRawUnsafe(`DROP SCHEMA public CASCADE`)

        // 2️⃣ Recreate schema
        await prisma.$executeRawUnsafe(`CREATE SCHEMA public`)

        console.log('✅ Database cleaned. All tables removed.')
    } catch (err) {
        console.error('❌ Error:', err)
    } finally {
        await prisma.$disconnect()
    }
}

dropAllTables()
