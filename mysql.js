const express = require('express');
const db = require('./db');  // MySQL 연결 파일을 가져옴

const app = express();

// 간단한 GET 요청 처리
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => { // users 테이블에서 모든 데이터를 조회
    if (err) {
      console.error('쿼리 오류: ', err);
      res.status(500).send('서버 오류');
    } else {
      res.json(results);
    }
  });
});

app.listen(3001, () => {
  console.log('서버가 http://localhost:3001에서 실행 중입니다.');
});
