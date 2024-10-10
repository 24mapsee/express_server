const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
    const { origin, destination } = req.query;

    try {
        const response = await axios.post('https://api.odyssey.com/v1/public-transport/directions', {
            origin,
            destination,
            mode: 'transit',
            departure_time: 'now'
        }, {
            headers: {
                'Authorization': `Bearer YOUR_API_KEY`,
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching directions:', error.response ? error.response.data : error.message);
        res.status(500).send('Error fetching directions');
    }
});


module.exports = router;
