
const db = require('../config/db');
exports.dbinfo = (req, res) => {
  const query = "select * from user_info where UID = 1"
  db.query(query, (error, results) => {
    if (error) {
      console.error('쿼리 실행 실패: ', error);
      return;
    }
    res.json({ results });  // 클라이언트에 응답
    console.log('쿼리 결과: ', results);
  });

  //res.json({ host:db.config.host, user:db.config.user, database:db.config.database });  // 클라이언트에 응답


};
