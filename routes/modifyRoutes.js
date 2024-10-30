const express = require('express');
const router = express.Router();
const modifyInfoController = require('../controllers/modifyInfoController');

// 사용자 정보 수정 엔드포인트 설정
router.put('/:userId', modifyInfoController.modifyUserInfo);

module.exports = router;
