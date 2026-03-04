const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const getTodayDateYYYYMMDD = require("../src/utils/getTodayDateYYYYMMDD");
const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('123456', 10);
    const adminPassword = await bcrypt.hash('Dhaka@1230', 10);
    const todayDate = getTodayDateYYYYMMDD();

    // Creating customers
   await prisma.customer.createMany({
        data: [
            {
                first_name: 'John Doe',
                uid: parseInt(todayDate)+1,
                email: 'john@example.com',
                password: hashedPassword,
                gender: 'male',
                phone: '01255',
                role: 'user',
            },
            {
                first_name: 'Hub Manager',
                uid: parseInt(todayDate)+2,
                email: 'manager@omninestglobal.com',
                password: adminPassword,
                gender: 'male',
                phone: '000000000',
                role: 'admin',
            },
        ]
    });
    await prisma.siteSetting.create({
        data: {
            site_name: 'My Amazing Site',
            description: 'A site for all things amazing.',
            logo: 'logo_url_here',
            address: '123 Amazing St, Cityville',
            phone: '123-456-7890',
            email: 'contact@amazing.com',
            whatsapp: '1234567890',
            default_currency: 1
        },
    });

    await prisma.currency.create({
        data: {
            currency_name : 'USD',
            currency_sign: '$',
            currency_rate : 1
        }
    });

    await prisma.user.create({
        data: {
            name : 'Super Administrator',
            email: 'admin@demo.com',
            password : adminPassword,
            role   : 'admin',
        }
    });

   await prisma.attribute.createMany({
       data: [
           {name: 'Size'},
           {name: 'Color'},
           {name: 'Weight'}
       ]
   });

    await prisma.attributeValue.createMany({
        data: [
            {value: 'Small', attributeId: 1, codeNumber: 'S'},
            {value: 'Medium', attributeId: 1,  codeNumber: 'M'},
            {value: 'Large', attributeId: 1,  codeNumber: 'L'},
            {value: 'Extra Large', attributeId: 1, codeNumber: 'XL'},
            {value: 'E.Extra Large', attributeId: 1, codeNumber: 'XXL'},
            {value: 'White', attributeId: 2, codeNumber: '#FFFFFF'},
            {value: 'Black', attributeId: 2, codeNumber: '#000000'},
            {value: 'Dark Gray', attributeId: 2, codeNumber: '#333333'},
            {value: 'Blue', attributeId: 2, codeNumber: '#007BFF'},
            {value: 'Green', attributeId: 2, codeNumber: '#28A745'},
            {value: 'Red', attributeId: 2, codeNumber: '#FF4136'},
            {value: 'Yellow', attributeId: 2, codeNumber: '#FFD700'},
            {value: 'Pink', attributeId: 2, codeNumber: '#FFC0CB'},
            {value: 'Purple', attributeId: 2, codeNumber: '#8E44AD'},
            {value: '500 Gram', attributeId: 3,  codeNumber: '0.5KG'},
            {value: '1 Kilo Gram', attributeId: 3,  codeNumber: '1KG'},
            {value: '2 Kilo Gram', attributeId: 3,  codeNumber: '2KG'},
            {value: 'Half Liter', attributeId: 3,  codeNumber: '0.5Ltr'},
            {value: '1 Liter', attributeId: 3,  codeNumber: '1Ltr'},
            {value: '2 Liter', attributeId: 3,  codeNumber: '2Ltr'},
            {value: '5 Liter', attributeId: 3,  codeNumber: '5Ltr'},
        ]
    });

    await prisma.label.createMany({
        data: [
            {
                id: 1,
                name: 'Hot Products',
                slug: 'hot-products'
            },
            {
                id: 2,
                name: 'Best Sellers',
                slug: 'best-sellers'
            },
            {
                id: 3,
                name: 'Most Popular',
                slug: 'most-popular'
            },
            {
                id: 4,
                name: 'Trending Now',
                slug: 'trending-now'
            },
            {
                id: 5,
                name: 'Top Rated',
                slug: 'top-rated'
            },
            {
                id: 6,
                name: 'Flash Deals',
                slug: 'flash-deals'
            },
            {
                id: 7,
                name: 'Premium Collection',
                slug: 'premium-collection'
            }
        ]
    })


    // Creating unique product categories
    // await prisma.productCategory.createMany({
    //     data: [
    //         { name: 'Milk and Dairies' , image: 'cat-1.png', icon: 'cat-1.png', color: '#FDFD96' },
    //         { name: 'Clothings' ,  image: 'cat-2.png', icon: 'cat-2.png', color: '#F7F98C' },
    //         { name: 'Pet Food',  image: 'cat-3.png', icon: 'cat-3.png', color: '#A7D8F7' },
    //         { name: 'Baking Material',  image: 'cat-4.png', icon: 'cat-4.png', color: '#90D1F2' },
    //         { name: 'Fresh Fruit' ,  image: 'cat-5.png', icon: 'cat-5.png', color: '#D6F7C3' },
    //         { name: 'Groceries' ,  image: 'cat-6.png', icon: 'cat-6.png', color: '#B8F1A1' },
    //         { name: 'Personal Care' ,  image: 'cat-7.png', icon: 'cat-7.png', color: '#FAD02E' },
    //         { name: 'Baby Care' ,  image: 'cat-8.png', icon: 'cat-8.png', color: '#FF9E9D' },
    //         { name: 'Pet Care',  image: 'cat-9.png', icon: 'cat-9.png', color: '#F6A5B2'},
    //         { name: 'Health Suppliment',  image: 'cat-10.png', icon: 'cat-10.png', color: '#A7D8D1'},
    //         { name: 'Beauty Product',  image: 'cat-11.png', icon: 'cat-11.png', color: '#B4E1FF'},
    //         { name: 'Electrongics',  image: 'cat-12.png', icon: 'cat-12.png', color: '#F1D4D4'},
    //     ]
    // });

}

main()
    .catch(e => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    });
