const getCoordinates = require('../api/geocoding'); // geocoding.js 파일
const findTransitRoutes = require('../api/transitRoute'); // transitRoute.js 파일

// 장소를 검색하고 경로를 찾는 함수
const searchAndFindRoute = async (startLocation, endLocation) => {
    try {
        // 1. 시작 장소와 도착 장소의 좌표를 각각 geocoding.js로 검색
        const startCoordinates = await getCoordinates(startLocation);
        const endCoordinates = await getCoordinates(endLocation);

        if (!startCoordinates || !endCoordinates) {
            console.log("좌표를 찾을 수 없습니다.");
            return null;
        }

        const { x: startX, y: startY } = startCoordinates;
        const { x: endX, y: endY } = endCoordinates;

        console.log(`출발지 좌표: (${startX}, ${startY}), 도착지 좌표: (${endX}, ${endY})`);

        // 2. 좌표를 이용하여 transitRoute.js로 경로 검색
        const route = await findTransitRoutes(startX, startY, endX, endY);
        if (route) {
            console.log("경로 정보:", route);
            return route;
        } else {
            console.log("경로를 찾을 수 없습니다.");
            return null;
        }
    } catch (error) {
        console.error("Error in searching and finding route:", error.message);
        return null;
    }
};

module.exports = searchAndFindRoute;