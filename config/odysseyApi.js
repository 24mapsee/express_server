const axios = require('axios');
require('dotenv').config();

const ODSAY_API_KEY = process.env.ODSAY_API_KEY;

// 장소명을 좌표로 변환하는 함수
const searchAddress = async (query) => {
    try {
        const response = await axios.get('https://api.odsay.com/v1/api/searchPoint', {
            params: {
                apiKey: ODSAY_API_KEY,
                q: query,
            }
        });
        return response.data;
    } catch (error) {
        console.error('주소 검색 중 오류 발생:', error);
        throw error;
    }
};

// 경로 검색 함수
const searchTransitRoute = async (departureLat, departureLng, arrivalLat, arrivalLng) => {
    try {
        const response = await axios.get('https://api.odsay.com/v1/api/searchPubTransPath', {
            params: {
                lang: 0,
                SX: departureLng,
                SY: departureLat,
                EX: arrivalLng,
                EY: arrivalLat,
                apiKey: ODSAY_API_KEY
            }
        });
        return response.data;
    } catch (error) {
        console.error('경로 검색 중 오류 발생:', error);
        throw error;
    }
};

module.exports = { searchAddress, searchTransitRoute };
