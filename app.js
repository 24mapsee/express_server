require("dotenv").config();
const express = require("express");
const cors = require("cors");

const mapRoutes = require("./routes/mapRoutes");
const userRoutes = require("./routes/userRoutes");
const feedRoutes = require("./routes/feedRoutes");
const profileRoutes = require('./routes/profileRoutes');
const routeRoutes = require("./routes/routeRoutes");
const modifyRoutes = require("./routes/modifyRoutes");
const followRoutes = require("./routes/followRoutes"); 

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
app.use('/modify', modifyRoutes);
app.use("/follow", followRoutes); 

app.listen(port, () => {
  console.log(`Mapsee server running on port ${port}`);
});
