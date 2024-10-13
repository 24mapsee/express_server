const admin = require('../models/firebase'); // Firebase Admin SDK
const db = require('../models/db'); // MySQL 데이터베이스
const { v4: uuidv4 } = require('uuid'); // UUID 생성 패키지

// MySQL에 Firebase UID 저장 함수
function saveUserToDatabase(uid, username, email) {
    return db.execute(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, uid]
    );
}

// 랜덤 사용자 생성 함수
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
        // Firebase Admin SDK로 사용자 생성
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
            displayName: username
        });

        // Firebase UID를 MySQL에 저장
        await saveUserToDatabase(userRecord.uid, username, email);

        res.status(201).json({
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
