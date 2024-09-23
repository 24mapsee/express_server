// naverApi.js
const axios = require('axios');

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

const searchPlace = async (query) => {
    try {
        const response = await axios.get('https://openapi.naver.com/v1/search/local.json', {
            params: {
                query: query,
                display: 5, // 검색 결과 개수
            },
            headers: {
                'X-Naver-Client-Id': NAVER_CLIENT_ID,
                'X-Naver-Client-Secret': NAVER_CLIENT_SECRET
            }
        });
        return response.data.items;
    } catch (error) {
        console.error('Naver API Error:', error.response ? error.response.data : error.message); // 에러 로그 추가
        throw error;
    }
};

module.exports = { searchPlace };
