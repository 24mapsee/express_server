require('dotenv').config();
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const path = require('path');
const router = express.Router();


const userRoutes = require('./routes/userRoutes');
const getCoordinates = require('./api/geocoding');
const findTransitRoutes = require('./api/transitRoute');

const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());


// Geocoding API Endpoint
app.get('/api/geocode', async (req, res) => {
  const { address } = req.query; // 클라이언트에서 'address' 파라미터를 받음
  if (!address) {
      return res.status(400).json({ error: 'Address parameter is required.' });
  }
  try {
      const coordinates = await getCoordinates(address);
      if (coordinates) {
          res.status(200).json(coordinates);
      } else {
          res.status(404).json({ error: 'No coordinates found for the given address.' });
      }
  } catch (error) {
      console.error('Geocoding error:', error);
      res.status(500).json({ error: 'Internal server error.' });
  }
});

// Transit Route API Endpoint
app.get('/api/findRoute', async (req, res) => {
  const { startX, startY, endX, endY } = req.query;
  if (!startX || !startY || !endX || !endY) {
      return res.status(400).json({ error: 'All coordinates (startX, startY, endX, endY) are required.' });
  }
  try {
      const route = await findTransitRoutes(startX, startY, endX, endY);
      if (route) {
          res.status(200).json(route);
      } else {
          res.status(404).json({ error: 'No route found for the given coordinates.' });
      }
  } catch (error) {
      console.error('Transit route finding error:', error.message);  // 상세 에러 메시지 출력
      res.status(500).json({ error: 'Internal server error.' });
  }
});



app.use('/api', router);
// Middleware

console.log('Routes initialized:');
console.log('/api/geocode -> Geocoding Service');
console.log('/api/findRoute -> Transit Route Finding Service');
console.log('/user ->', userRoutes);




app.use(express.static('public')); // 정적 파일 제공

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'odsay.html'));
});

console.log('Routes initialized:');
console.log('/user ->', userRoutes);


app.listen(port, () => {
  console.log(`Mapsee server running on port ${port}`);
});