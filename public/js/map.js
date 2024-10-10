const map = L.map('map').setView([37.5665, 126.978], 13); // 초기 지도 위치

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

async function getDirections() {
    const response = await fetch('/api/directions?origin=국민대학교&destination=서울특별시 종로구 세종대로 175');
    const data = await response.json();
    const routeCoordinates = data.routes[0].legs[0].steps.map(step => [step.start_location.lat, step.start_location.lng]);

    // 경로 표시
    L.polyline(routeCoordinates, { color: 'blue' }).addTo(map);
}

getDirections(); // 경로 요청
