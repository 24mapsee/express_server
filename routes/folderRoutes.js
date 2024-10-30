const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folderController');

// 유저의 폴더 목록 불러오기
router.post('/getPlaceFolders', folderController.getPlaceFolders);

// 특정 폴더에 속한 장소 목록 불러오기
router.post('/getPlacesInFolder', folderController.getPlacesInFolder);

// 새로운 폴더 생성
router.post('/createFolder', folderController.createFolder);

// 특정 폴더에 장소 추가
router.post('/addPlaceToFolder', folderController.addPlaceToFolder);

module.exports = router;