const axios = require('axios');
require('dotenv').config();

const googleApiKey = process.env.GOOGLE_API_KEY;

const getCoordinates = async (address) => {
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: address,
                key: googleApiKey
            }
        });

        // 응답 상태와 결과 검증
        if (response.data.status === 'OK' && response.data.results.length > 0) {
            const location = response.data.results[0].geometry.location;
            return {
                lat: location.lat,
                lng: location.lng
            };
        } else if (response.data.status === 'ZERO_RESULTS') {
            console.log(`No results found for the address: ${address}`);
            throw new Error(`No results found for the address: ${address}`);
        } else {
            console.log(`Geocoding API error: ${response.data.status}`);
            throw new Error(`Geocoding API error: ${response.data.status}`);
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error.message);
        throw new Error('Failed to fetch coordinates');
    }
};

module.exports = {
    getCoordinates
};
