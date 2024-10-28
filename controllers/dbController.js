// dbcontroller.js
const db = require('../models/db'); // MySQL 데이터베이스

// MySQL에 Firebase UID 저장 함수
async function saveUserToDatabase(uid, email, password) {
    try {
        return await db.execute(
            'INSERT INTO Users (user_id, email, password) VALUES (?, ?, ?)',
            [uid, email, password]
        );
    } catch (error) {
        console.error('Error saving user to database:', error);
        throw error;
    }
}


// MySQL에 장소 저장 함수
async function savePlaceDatabase(uid, place_id, latitude, longitude) {
    try {
        return await db.execute(
            'INSERT INTO Places (user_id, place_id, latitude, longitude) VALUES (?, ?, ?, ?)',
            [uid, place_id, latitude, longitude]
        );
    } catch (error) {
        console.error('Error saving user to database:', error);
        throw error;
    }
}
async function getPlaceDatabase(uid) {
    try {
        // Saved_Place에서 user_id로 정보 조회
        const [rows] = await db.execute(
            'SELECT * FROM Places WHERE user_id = ?',
            [uid]
        );
        return rows;  // 조회된 결과를 반환
    } catch (error) {
        console.error('Error retrieving place from database:', error);
        throw error;
    }
}

module.exports = {
    saveUserToDatabase,
    savePlaceDatabase,
    getPlaceDatabase
};
