require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3001;

// JSON 본문을 파싱할 수 있도록 설정
app.use(express.json());
app.use(cors());

// 게임 라우트 설정
const gameRoutes = require('./routes/gameRoutes');
app.use('/game', gameRoutes);

// HTML 파일 제공
app.use(express.static(path.join(__dirname, 'public')));
//네이버 지도 api
const naverRoutes = require('./routes/mapRoutes');
app.use('/api/naver', naverRoutes);

// 기본 루트
app.get('/', (req, res) => {
  res.send('ddd World!');
});
// 서버 시작
app.listen(port, async() => {
  //await saveDataFromDBToRedis();
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});

