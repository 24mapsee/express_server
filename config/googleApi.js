const axios = require('axios');
require('dotenv').config();

const googleApiKey = process.env.GOOGLE_API_KEY;

const getTransitRoutes = async (origin, destination) => {
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
            params: {
                origin,
                destination,
                mode: 'transit', // 대중교통 모드를 설정
                key: googleApiKey,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching transit routes:', error);
        throw new Error('Failed to fetch transit routes');
    }
};

module.exports = {
    getTransitRoutes,
};
