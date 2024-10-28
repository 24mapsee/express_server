const admin = require('firebase-admin');
const serviceAccount = require('./mapsee-8a424-firebase-adminsdk-cys83-b267c9438a.json'); // 올바른 경로로 수정
// Firebase Admin SDK 초기화
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mapsee-8a424.firebaseio.com"
});

module.exports = admin;
