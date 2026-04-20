const axios = require("axios");
const { pathaoConfig } = require("@/config/pathao.js");

// const getPathaoToken = async (client_id=null,client_secret=null) => {
//     try {
//         const response = await axios.post(
//             `${pathaoConfig.baseURL}/aladdin/api/v1/issue-token`,
//             {
//                 client_id: client_id || pathaoConfig.client_id,
//                 client_secret: client_secret|| pathaoConfig.client_secret,
//                 grant_type: pathaoConfig.grant_type,
//                 username: pathaoConfig.username,
//                 password: pathaoConfig.password
//             },
//             {
//                 headers: {
//                     "Content-Type": "application/json"
//                 }
//             }
//         );
//         return response.data;
//     } catch (error) {
//         console.error("Pathao Token Error:", error.response?.data || error.message);
//         throw error;
//     }
//     /** Example Response
//      * {
//      *     "success": true,
//      *     "data": {
//      *         "token_type": "Bearer",
//      *         "expires_in": 7776000,
//      *         "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzNTIiLCJhdWQiOlsiMjY3Il0sImV4cCI6MTc4MDc4MzIwNiwibmJmIjoxNzczMDA3MjA2LCJpYXQiOjE3NzMwMDcyMDYsImp0aSI6ImMxM2FlZjRkY2Q3MTU4YzFkMWY1NDk0YjM0MmY1N2JjNzcxNzFkNzkxYWUyNmVkZTQwYjYyOGQ2NjFmMTY3YTMiLCJtZXJjaGFudF9pZCI6Iks0b2VFOWtlMEIiLCJzY29wZXMiOltdfQ.c0DUhtxD50YJzTUtD3nBiPyV4Bo4t4CrqndEQLmpM5MJcSoVh6E_tCccmT9931E1pSFJAa2rdFMWTDen4ptSgBeAGHTjr1nhWhBQtm3anDu5z5B-cknt173refC20G-Rx1Fz8glf8LOY2EC6B8Ocgs9m-FEdJkwmmq9_XweKHe0RfKIS_mTDGSvOYGpw6p_syp7uqBgOaMrWN_Ttz_mOS5vT7OKVJN6WLonHxcTbAk-hJwMz7yqObI8u4E5xkCLeHhKphnPD2ivCLyh9_IZ5FejAy79pYC7LC_0UtRr86_G8U_fnpa6NVgrNOM6HSqRqhkGO7jt2Dy64JcAbcOsZY13ZhZ7--NPBItVYzL8rqqrqA9J4ZBy4KtH-UPXHLU3Wzucr3_jsOwJyTuMcGXqjtK8lwYZgcDWAYwTiOE95dSqO6qZWQdKOU1vBgkWAUH_R4FwRVSVhLLV2_nKB82biBy6z-KawCuDRjzmC1jrD2RjZq5BNg8N-g9tdsJxoymVgelPdIIoT7y6ngkAfimi-wDeu2G5b3O2vJGjE_q7vRhy3K1vlp1rgBzZ0-7xrS6aJ7_HbcFujzQu123z0f4oxL8penAa3hvgF283MmQEUwOwNqwGtWdggFUv50ibQ5B7C9FOKbIl0j9kMphNQJp-ac2a0lDynXc_hi9bHexIFmvI",
//      *         "refresh_token": "def502009f376b933f4cbf2f73e56271c6cf97b2355a37e92bef3f06cdc2374a316b681f511d195a9c443e086b4591ef2dcb219270ee8fe7d69356b6f767b76b8e50a2b53a24f78d72e911295b94a9b626608d0cdd683601e5140d80da5ce5995ccaeefb034e2628c3e9928a0725c96ae678f9ae6cd6d8a89b477466096ae65d311da042d98b289529c60134b8c68758696f6971b21d9d3abd1357701383428246f08aabf5765cd16da497004a526b11da828073787dc55046938f1a1945d4c2bd0ed742d9332fb4e735f260fb34bfa717671096a3d470e621d4d8bd3a492de89a398d7a51644d353d73d40e1d9009fb227b7f890bf99d465c0e2b4227a278913520e32c96e0a18342320ab8c198f987ff447cf9b9125f6e29ca9a18f20a0088fd292cc534f1e076e13d1ad3db6c689e0fdd375b8a5948a8322c8567d7f9a2433036f94ab7ab45cbdbc94bcf2b7af2187814ce6392b544c9af"
//      *     }
//      * }
//      */
// };

let cachedToken = null;
let tokenExpiresAt = null;

const getPathaoToken = async () => {
    if (cachedToken && tokenExpiresAt > Date.now()) {
        return cachedToken;
    }

    const response = await axios.post(
        `${pathaoConfig.baseURL}/aladdin/api/v1/issue-token`,
        {
            client_id: pathaoConfig.client_id,
            client_secret: pathaoConfig.client_secret,
            grant_type: pathaoConfig.grant_type,
            username: pathaoConfig.username,
            password: pathaoConfig.password,
        }
    );

    cachedToken = response.data.data.access_token;
    tokenExpiresAt = Date.now() + response.data.data.expires_in * 1000;

    return cachedToken;
};

// const createOrder = async (access_token, data) => {
//     try {
//         const response = await axios.post(
//             `${pathaoConfig.baseURL}/aladdin/api/v1/orders`,
//             data,
//             {
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${access_token}`,
//                 },
//             }
//         );
//     } catch (error) {
//         console.error(error.response?.data || error.message);
//     }
// }

const createOrder = async (orderData) => {
    try {
        const token = await getPathaoToken();

        const response = await axios.post(
            `${pathaoConfig.baseURL}/aladdin/api/v1/orders`,
            orderData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    } catch (error) {
        throw {
            message: "Pathao order failed",
            error: error.response?.data || error.message,
        };
    }
};


// async function createStore(access_token) {
//     try {
//         const response = await axios.post(
//             `${pathaoConfig.baseURL}/aladdin/api/v1/stores`,
//             {
//                 name: "Test Store",
//                 contact_name: "Test Merchant",
//                 contact_number: "01837664478",
//                 secondary_contact: "01403251501",
//                 otp_number: "01837664478",
//                 address: "House 123, Road 4, Sector 10, Uttara, Dhaka-1230, Bangladesh",
//                 city_id: 1,
//                 zone_id: 1,
//                 area_id: 1
//             },
//             {
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${access_token}`,
//                 },
//             }
//         );
//     } catch (error) {
//         console.error(error.response?.data || error.message);
//     }
//
//     /**
//      * {
//      *   message: 'Store created successfully!',
//      *   type: 'success',
//      *   code: 200,
//      *   data: { store_id: 150063, store_name: ' Test Store' }
//      * }
//      */
// }

const createStore = async (storeData) => {
    try {
        const token = await getPathaoToken();

        const response = await axios.post(
            `${pathaoConfig.baseURL}/aladdin/api/v1/stores`,
            storeData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    } catch (error) {
        throw {
            message: "Store creation failed",
            error: error.response?.data || error.message,
        };
    }
};

// services/courier/pathaoService.js
const cancelOrder = async (consignment_id, reason = "Customer request") => {
    try {
        const token = await getPathaoToken();

        const response = await axios.post(
            `${pathaoConfig.baseURL}/aladdin/api/v1/orders/${consignment_id}/cancel`,
            { reason },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        throw {
            message: "Failed to cancel Pathao order",
            error: error.response?.data || error.message,
        };
    }
};

/** Controller example usage

 const cancelCourierParcel = async (req, res) => {
 try {
     const { orderId, reason } = req.body;

     const courier = await prisma.courierOrder.findFirst({
     where: { orderId, courier: "PATHAO" },
     });

     if (!courier) {
     return res.status(404).json({
     success: false,
     message: "Courier parcel not found",
     });
     }

     const result = await cancelOrder(
     courier.consignmentId,
     reason || "Order cancelled by customer"
     );

     await prisma.courierOrder.update({
     where: { id: courier.id },
     data: { status: "cancelled" },
     });

     res.json({
     success: true,
     message: "Courier parcel cancelled",
     data: result,
     });
     } catch (error) {
     res.status(500).json({
     success: false,
     message: error.message,
     error: error.error,
     });
     }
 };

 */

const trackOrder = async (consignment_id) => {
    try {
        const token = await getPathaoToken();

        const response = await axios.get(
            `${pathaoConfig.baseURL}/aladdin/api/v1/orders/${consignment_id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        throw {
            message: "Failed to track Pathao order",
            error: error.response?.data || error.message,
        };
    }
};


module.exports = {
    getPathaoToken,
    createOrder,
    createStore,
    cancelOrder
}