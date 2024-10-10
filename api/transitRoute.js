const axios = require('axios');
require('dotenv').config();

const findTransitRoutes = async (startX, startY, endX, endY) => {
    const baseURL = 'https://api.odsay.com/v1/api/searchPubTransPath';
    try {
        const response = await axios.get(baseURL, {
            params: {
                apiKey: process.env.ODSAY_API_KEY,
                SX: startX,
                SY: startY,
                EX: endX,
                EY: endY,
                OPT: 0, // 최적경로
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error finding transit routes:', error);
        return null;
    }
}

module.exports = findTransitRoutes;
