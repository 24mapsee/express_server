require("dotenv").config();
const express = require("express");
const cors = require("cors");

const mapRoutes = require("./routes/mapRoutes");
const userRoutes = require("./routes/userRoutes");
const feedRoutes = require("./routes/userRoutes");
const profileRoutes = require('./routes/profileRoutes');
const routeRoutes = require("./routes/routeRoutes");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/map", mapRoutes);
app.use("/user", userRoutes);
app.use("/feed", feedRoutes);
app.use("/route", routeRoutes);

app.use('/profile', profileRoutes);

app.listen(port, () => {
  console.log(`Mapsee server running on port ${port}`);
});
