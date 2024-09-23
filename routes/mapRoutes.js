// naverRoutes.js
const express = require('express');
const router = express.Router();
const { searchPlace } = require('../naverApi');

router.get('/places', async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }
        
        console.log('Received query:', query); // 로그 추가
        const places = await searchPlace(query);
        console.log('Places found:', places); // 로그 추가
        
        res.json(places);
    } catch (error) {
        console.error('Error in /places route:', error); // 에러 로그 추가
        res.status(500).json({ error: 'Failed to fetch places' });
    }
});

module.exports = router;
