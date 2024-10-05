const express = require('express');
const cors = require('cors');
const path = require('path');
//const bodyParser = require('body-parser');
require('dotenv').config();

const mapRoutes = require('./routes/mapRoutes');
const userRoutes = require('./routes/userRoutes');
const transitRoutes = require('./routes/transit');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/map', mapRoutes);
app.use('/user', userRoutes);
app.use('/transit', transitRoutes);

app.use(express.static(path.join(__dirname,'public')));

console.log('Routes initialized:');
console.log('/map ->', mapRoutes);
console.log('/user ->', userRoutes);


app.listen(port, () => {
  console.log(`Mapsee server running on port ${port}`);
});