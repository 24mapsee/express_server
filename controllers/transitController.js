const { getTransitRoutes } = require('../config/googleApi');
const { getCoordinates } = require('../config/addressSearch');

const findTransitRoutes = async (req, res) => {
    const { origin, destination } = req.query;

    if (!origin || !destination) {
        return res.status(400).json({ error: 'Please provide both origin and destination' });
    }

    try {
        // 출발지와 도착지를 좌표로 변환
        const originCoords = await getCoordinates(origin);
        const destinationCoords = await getCoordinates(destination);

        // 좌표를 사용해 경로 탐색
        const routes = await getTransitRoutes(`${originCoords.lat},${originCoords.lng}`, `${destinationCoords.lat},${destinationCoords.lng}`);

        // 서버 쪽에서 직접 경로 정보를 가공해서 클라이언트로 전달할 수도 있음
        const leg = routes.routes[0].legs[0];
        let output = {
            start_address: leg.start_address,
            end_address: leg.end_address,
            distance: leg.distance.text,
            duration: leg.duration.text,
            steps: []
        };

        leg.steps.forEach((step) => {
            const stepInfo = {
                instruction: step.html_instructions,
                distance: step.distance.text,
                duration: step.duration.text,
                transit: step.transit_details ? {
                    vehicle: step.transit_details.line.name,
                    departure_stop: step.transit_details.departure_stop.name,
                    arrival_stop: step.transit_details.arrival_stop.name
                } : null
            };
            output.steps.push(stepInfo);
        });

        return res.status(200).json(output);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    findTransitRoutes,
};
