const axios = require('axios');
require('dotenv').config();

const ODYSSEY_API_KEY = process.env.ODYSSEY_API_KEY;

const addressSearch = async (query) => {
    try {
        const response = await axios.get('https://api.odysseymaps.com/v1/geo/address/search', {
            params: { query },
            headers: { Authorization: `Bearer ${ODYSSEY_API_KEY}` }
        });

        // API 결과를 반환
        return response.data;
    } catch (error) {
        console.error('주소 검색 중 오류 발생:', error);
        throw error;
    }
};

module.exports = addressSearch;
