const { searchAddress, searchTransitRoute } = require('../config/odysseyApi');

// 주소 검색 처리
const getCoordinates = async (req, res) => {
    const { query } = req.query;

    try {
        const addressData = await searchAddress(query);
        res.json(addressData);
    } catch (error) {
        console.error('주소 검색 오류:', error);
        res.status(500).send('주소 검색 중 오류가 발생했습니다.');
    }
};

// 경로 검색 처리
const getTransitRoute = async (req, res) => {
    const { departureLat, departureLng, arrivalLat, arrivalLng } = req.query;

    try {
        const routeData = await searchTransitRoute(departureLat, departureLng, arrivalLat, arrivalLng);
        res.json(routeData);
    } catch (error) {
        console.error('경로 검색 오류:', error);
        res.status(500).send('경로 검색 중 오류가 발생했습니다.');
    }
};

module.exports = { getCoordinates, getTransitRoute };
