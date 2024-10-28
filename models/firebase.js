const admin = require("firebase-admin");
const serviceAccountPath =
  process.env.NODE_ENV === "production"
    ? "/config/serviceAccountKey"
    : "../mapsee-8a424-firebase-adminsdk-cys83-b267c9438a.json";
const serviceAccount = require(serviceAccountPath);

// Firebase Admin SDK 초기화
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mapsee-8a424.firebaseio.com",
});

module.exports = admin;
