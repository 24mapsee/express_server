const axios = require('axios');

const getCoordinates = async (query) => {
    try {
        const url = 'https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode';
        const params = {
            query: query
        };
        const headers = {
            'x-ncp-apigw-api-key-id': process.env.NAVER_CLIENT_ID,
            'x-ncp-apigw-api-key': process.env.NAVER_CLIENT_SECRET,
            'Accept': 'application/json'
        };
        const response = await axios.get(url, { params, headers });
        return response.data;
    } catch (error) {
        console.error('Error getting coordinates:', error.response ? error.response.data : error.message);
        return null;
    }
}

module.exports = getCoordinates;
