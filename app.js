require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const mapRoutes = require("./routes/mapRoutes");
const userRoutes = require("./routes/userRoutes");
const feedRoutes = require("./routes/feedRoutes");
const routeRoutes = require("./routes/routeRoutes");
const profileRoutes = require('./routes/profileRoutes');
const folderRoutes = require('./routes/folderRoutes');
const modifyRoutes = require("./routes/modifyRoutes");
const followRoutes = require("./routes/followRoutes"); 

const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // JSON 요청 본문 파싱

// Routes
app.use("/map", mapRoutes);
app.use("/user", userRoutes);
app.use("/feed", feedRoutes);
app.use("/route", routeRoutes);
app.use('/profile', profileRoutes);
app.use("/folder", folderRoutes);
app.use('/modify', modifyRoutes);
app.use("/follow", followRoutes); 


app.listen(port, () => {
  console.log(`Mapsee server running on port ${port}`);
});
