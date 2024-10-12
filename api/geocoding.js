const axios = require('axios');

// 주소로 좌표를 찾기 위한 네이버 지오코딩 API
const getCoordinates = async (query) => {
    try {
        const url = 'https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode';
        const params = { query };
        const headers = {
            'x-ncp-apigw-api-key-id': process.env.NAVER_CLIENT_ID,
            'x-ncp-apigw-api-key': process.env.NAVER_CLIENT_SECRET,
            'Accept': 'application/json'
        };

        const response = await axios.get(url, { params, headers });
        
        // 지오코딩 API 결과 확인
        if (response.data.addresses && response.data.addresses.length > 0) {
            const { x, y } = response.data.addresses[0];
            return { x, y };
        } else {
            console.log('지오코딩 결과가 없습니다. 장소 검색을 시도합니다.');
            return await searchPlace(query); // 여기가 searchPlace 함수 호출 부분
        }
    } catch (error) {
        console.error('Error getting coordinates:', error.response ? error.response.data : error.message);
        return null;
    }
}

// 장소 이름으로 좌표를 찾기 위한 네이버 장소 검색 API
const searchPlace = async (query) => {
    try {
        const url = 'https://openapi.naver.com/v1/search/local.json';
        const params = { query, display: 5, sort: 'random' };
        const headers = {
            'X-Naver-Client-Id': process.env.NAVER_SEARCH_CLIENT_ID,
            'X-Naver-Client-Secret': process.env.NAVER_SEARCH_CLIENT_SECRET,
            'Accept': 'application/json'
        };

        const response = await axios.get(url, { params, headers });
        
        if (response.data.items && response.data.items.length > 0) {
            const place = response.data.items[0];
            const { title, address, roadAddress, mapx, mapy } = place;

            // 좌표에 소수점 추가
            const x = `${mapx.substring(0, 3)}.${mapx.substring(3)}`;
            const y = `${mapy.substring(0, 2)}.${mapy.substring(2)}`;

            console.log(`장소: ${title}, 도로명 주소: ${roadAddress}, 지번 주소: ${address}, 좌표: (${x}, ${y})`);
            return { title, address, roadAddress, x, y };
        } else {
            console.log('장소 검색 결과가 없습니다.');
            return null;
        }
    } catch (error) {
        console.error('Error searching place:', error.response ? error.response.data : error.message);
        return null;
    }
}

module.exports = getCoordinates;
