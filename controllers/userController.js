const admin = require('../models/firebase'); // Firebase Admin SDK
const { v4: uuidv4 } = require('uuid'); // UUID 생성 패키지
const { saveUserToDatabase, savePlaceDatabase, getPlaceDatabase } = require('./dbController'); // dbcontroller에서 함수 가져오기


// 랜덤 사용자 생성 함수 테스트용임
exports.createRandomUser = async (req, res) => {
    const randomUsername = `user_${uuidv4()}`;
    const randomEmail = `${uuidv4()}@example.com`;
    const randomPassword = 'password123';

    try {
        // Firebase Admin SDK로 사용자 생성
        const userRecord = await admin.auth().createUser({
            email: randomEmail,
            password: randomPassword,
            displayName: randomUsername
        });

        // Firebase UID와 함께 MySQL에 사용자 저장
        await saveUserToDatabase(userRecord.uid, randomUsername, randomEmail);

        res.status(201).json({
            message: 'Random user created and saved to database',
            uid: userRecord.uid,
            username: randomUsername,
            email: randomEmail
        });
    } catch (error) {
        console.error('Error creating random user:', error);
        res.status(400).json({
            message: 'Error creating random user',
            error: error.message
        });
    }
};

// 회원가입 함수
exports.register = async (req, res) => {
    /*
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    */
    const { email, password, birthdate, gender, tel } = req.body;

    try {
        // Firebase Admin SDK로 사용자 생성
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
            displayName: email
        });

        // Firebase UID를 MySQL에 저장
        await saveUserToDatabase(userRecord.uid, userRecord.email, password);

        res.status(200).json({
            message: 'User created and saved to database',
            uid: userRecord.uid
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(400).json({
            message: 'Error creating user',
            error: error.message
        });
    }
};

exports.SavePlaceTest = async (req, res) => {
    /*
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    */
    const uid = 3;
    const place_id = 1;
    const latitude = 6;
    const longitude = 112.31;
    //const { uid, name, latitude, longitude } = req.body;

    try {
        await savePlaceDatabase(uid, place_id, latitude, longitude);

        res.status(200).json({
            message: 'Place saved to database',
            uid: uid,
            place_id: place_id,
            latitude:latitude,
            longitude: longitude
        });
    } catch (error) {
        console.error('Error Place saved to database:', error);
        res.status(400).json({
            message: 'Error Place saved to database',
            error: error.message
        });
    }
};



exports.SavePlace = async (req, res) => {
    /*
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    */
    const { uid, place_id, latitude, longitude } = req.body;

    try {
        await savePlaceDatabase(uid, place_id, latitude, longitude);

        res.status(200).json({
            message: 'Place saved to database',
            uid: uid,
            place_id: place_id,
            latitude:latitude,
            longitude: longitude
        
        });
    } catch (error) {
        console.error('Error Place saved to database:', error);
        res.status(400).json({
            message: 'Error Place saved to database',
            error: error.message
        });
    }
};


exports.GetPlaceTest = async (req, res) => {

    const uid = 3;
    try {
        // 데이터베이스에서 장소 정보를 가져옴
        const placeInfo = await getPlaceDatabase(uid);

        // 조회한 데이터를 클라이언트에 응답
        res.status(200).json({
            message: 'Place retrieved from database',
            uid: uid,
            placeInfo: placeInfo  // 가져온 데이터 추가
        });
    } catch (error) {
        console.error('Error retrieving place info:', error);
        res.status(400).json({
            message: 'Error retrieving place info',
            error: error.message
        });
    }
};
exports.GetPlace = async (req, res) => {
    const { uid } = req.body;

    try {
        // 데이터베이스에서 장소 정보를 가져옴
        const placeInfo = await getPlaceDatabase(uid);

        // 조회한 데이터를 클라이언트에 응답
        res.status(200).json({
            message: 'Place retrieved from database',
            uid: uid,
            placeInfo: placeInfo  // 가져온 데이터 추가
        });
    } catch (error) {
        console.error('Error retrieving place info:', error);
        res.status(400).json({
            message: 'Error retrieving place info',
            error: error.message
        });
    }
};
