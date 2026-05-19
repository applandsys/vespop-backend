require('module-alias/register');
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("Its An API Server");
});

/**
 * ======================
 *        ROUTES
 * ======================
 */

// USER Auth
const userAuthRoute = require('./src/modules/auth/route/userAuthRoute');
// Customer AUTH
const customerAuthRoute = require('./src/modules/auth/route/customerAuthRoute');
// Ecommerce
const customerRoute = require('./src/modules/customer/route/customerRoute');
const productRoute = require('./src/modules/product/route/productRoute.js');
const vendorRoute = require('./src/modules/vendor/route/vendorRoute');
const categoryRoute = require('./src/modules/product/route/categoryRoute');
const userStatsRoute = require('./src/modules/reports/route/userStatsRoute');
const userDataRoute = require('./src/modules/customer/route/userDataRoute.js');
// Supplier
const supplierRoute = require('./src/modules/supplier/route/supplierRoute');
// Admin
const adminStatsRoute = require('./src/modules/reports/route/adminStatsRoute.js');
const settingRoute = require('./src/modules/setting/route/settingRoute.js');
const productAdminRoute = require('./src/modules/product/route/productAdminRoute');
const orderAdminRoute = require('./src/modules/order/route/orderAdminRoute.js');
const orderReturnRoute = require('./src//modules/order/route/orderReturnRoute.js');
const purchaseAdminRoute = require('./src/modules/purchase/route/purchaseAdminRoute');
const ReviewAdminRoute = require('./src/modules/review-rating/route/ReviewAdminRoute');
// Inventory
const inventoryStockRoute = require('./src/modules/inventory/route/stockRoute');
// Third Party API
const fraudCheckRoute = require('./src/modules/thirdparty/route/fraudCheckRoute');
const courierRoute = require('./src/modules/thirdparty/route/courierRoute')
const fbPixelRoute = require('./src/modules/thirdparty/route/fbPixelRoute.js')
const couponRoutes = require('./src/modules/coupon-deal/route/coupon.routes.js');
const dealRoutes = require('./src/modules/coupon-deal/route/deal.routes.js');
const widgetRoutes = require('./src//modules/widget/widget.routes.js');
const navigationRoute =   require('./src//modules/setting/route/navigation.routes.js');

/**
 * ======================
 *     API ENDPOINTS
 * ======================
 */

// http://localhsot/v1/customer
app.use(`/${process.env.VERSION}/customer/auth`, customerAuthRoute);
app.use(`/${process.env.VERSION}/customer`, customerRoute);

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

// Account
app.use(`/${process.env.VERSION}/account/profit`, ReviewAdminRoute);

// User
app.use(`/${process.env.VERSION}/user/auth`, userAuthRoute);
app.use(`/${process.env.VERSION}/user/stats`, userStatsRoute);
app.use(`/${process.env.VERSION}/user/data`, userDataRoute);

// Inventory
app.use(`/${process.env.VERSION}/inventory`, inventoryStockRoute);
app.use(`/${process.env.VERSION}/purchase`, inventoryStockRoute);

// ThirdParty APIS
// app.use(`/${process.env.VERSION}/third-party`, thirdPartyApiRoute);
app.use(`/${process.env.VERSION}/fraud-check`, fraudCheckRoute);
app.use(`/${process.env.VERSION}/courier`, courierRoute);
app.use(`/${process.env.VERSION}/api-integration/fb-pixel`, fbPixelRoute);

app.use(`/${process.env.VERSION}/coupon`, couponRoutes);
app.use(`/${process.env.VERSION}/deal`, dealRoutes);
app.use(`/${process.env.VERSION}/widgets`, widgetRoutes);
app.use(`/${process.env.VERSION}/navigation`, navigationRoute);

app.use(`/${process.env.VERSION}/order-returns`,orderReturnRoute);

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
const port = process.env.PORT || 4000;

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on ${port} PORT`);
});
