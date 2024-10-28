require("dotenv").config();
const express = require("express");
const cors = require("cors");
console.log('DB_HOST:', process.env.DB_HOST); // 예상 출력: 175.45.195.197
console.log('DB_USER:', process.env.DB_USER);

const mapRoutes = require("./routes/mapRoutes");
const userRoutes = require("./routes/userRoutes");
const feedRoutes = require("./routes/userRoutes");
const profileRoutes = require('./routes/profileRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/map", mapRoutes);
app.use("/user", userRoutes);
app.use("/feed", feedRoutes);
app.use('/profile', profileRoutes);

app.listen(port, () => {
  console.log(`Mapsee server running on port ${port}`);
});
