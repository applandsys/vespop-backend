require('module-alias/register');
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

/**
 * ✅ CORS: Allow everything (no checks)
 */
app.use(cors());

/**
 * ✅ Body parsing
 */
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

/**
 * ✅ Health check
 */
app.get('/', (req, res) => {
    res.send("Its An API Server");
});

/**
 * ======================
 *        ROUTES
 * ======================
 */

// Auth
const customerAuthRoute = require('@/modules/auth/route/customerAuthRoute');
const userAuthRoute = require('@/modules/auth/route/userAuthRoute');

// Ecommerce
const customerRoute = require('@/modules/ecommerce/route/customerRoute');
const productRoute = require('@/modules/ecommerce/route/productRoute');
const vendorRoute = require('@/modules/ecommerce/route/vendorRoute');
const categoryRoute = require('@/modules/ecommerce/route/categoryRoute');
const userStatsRoute = require('@/modules/ecommerce/route/stats/userStatsRoute');
const userDataRoute = require('@/modules/ecommerce/route/user/userDataRoute');

// Supplier
const supplierRoute = require('@/modules/supplier/route/supplierRoute');

// Admin
const adminStatsRoute = require('@/modules/ecommerce/route/stats/adminStatsRoute');
const settingRoute = require('@/modules/ecommerce/route/settingRoute');
const productAdminRoute = require('@/modules/ecommerce/route/productAdminRoute');
const orderAdminRoute = require('@/modules/ecommerce/route/admin/orderAdminRoute');
const purchaseAdminRoute = require('@/modules/ecommerce/route/admin/purchaseAdminRoute');
const ReviewAdminRoute = require('@/modules/ecommerce/route/admin/ReviewAdminRoute');

// Inventory
const inventoryStockRoute = require('@/modules/inventory/route/stockRoute');

// Third Party API
const thirdPartyApi = require('@/modules/thirdparty/route/fraudCheckRoute')

const courierRoute = require('@/modules/thirdparty/route/courierRoute')
/**
 * ======================
 *     API ENDPOINTS
 * ======================
 */

// http://localhsot/v1/customer
app.use(`/${process.env.VERSION}/customer`, customerRoute);
app.use(`/${process.env.VERSION}/customer/auth`, customerAuthRoute);

// Products & Categories
app.use(`/${process.env.VERSION}/product`, productRoute);
app.use(`/${process.env.VERSION}/category`, categoryRoute);

// Vendor
app.use(`/${process.env.VERSION}/vendor`, vendorRoute);

// Supplier
app.use(`/${process.env.VERSION}/supplier`, supplierRoute);

// Admin
app.use(`/${process.env.VERSION}/admin/product`, productAdminRoute);
app.use(`/${process.env.VERSION}/admin/order`, orderAdminRoute);
app.use(`/${process.env.VERSION}/admin/setting`, settingRoute);
app.use(`/${process.env.VERSION}/admin/stats`, adminStatsRoute);
app.use(`/${process.env.VERSION}/admin/purchase`, purchaseAdminRoute);
app.use(`/${process.env.VERSION}/admin/reviews`, ReviewAdminRoute);

// User
app.use(`/${process.env.VERSION}/user/auth`, userAuthRoute);
app.use(`/${process.env.VERSION}/user/stats`, userStatsRoute);
app.use(`/${process.env.VERSION}/user/data`, userDataRoute);

// Inventory
app.use(`/${process.env.VERSION}/inventory`, inventoryStockRoute);
app.use(`/${process.env.VERSION}/purchase`, inventoryStockRoute);

// ThirdParty APIS
app.use(`/${process.env.VERSION}/third-party`, thirdPartyApi);
app.use(`/${process.env.VERSION}/courier`, courierRoute);
/**
 * ======================
 *   STATIC FILES
 * ======================
 */
app.use(express.static('public'));

/**
 * ======================
 *      SERVER
 * ======================
 */
const port = process.env.PORT || 4001;

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on ${port} PORT`);
});
