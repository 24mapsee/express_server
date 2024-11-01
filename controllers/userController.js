const db = require("../models/db"); // MySQL 데이터베이스
const admin = require("../models/firebase"); // Firebase Admin SDK
const bcrypt = require("bcrypt");
const axios = require("axios");

// 디폴트 폴더 생성 함수
const createDefaultFolder = async (userId, connection) => {
  try {
    await connection.execute(
      "INSERT INTO Place_Folders (user_id, folder_name, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)",
      [userId, "내 저장소"]
    );
  } catch (error) {
    throw new Error("Error creating default folder: " + error.message);
  }
};

// 1. 자체 회원가입 (아이디/비밀번호)
exports.registerNative = async (req, res) => {
  const { userId, password } = req.body; // 클라이언트에서 제공한 사용자 ID와 비밀번호
  const connection = await db.getConnection();

  try {
    // 기존 userId 중복 확인
    const [existingUser] = await connection.execute(
      "SELECT * FROM Users WHERE local_id = ?",
      [userId]
    );

    if (existingUser.length > 0) {
      // 중복된 아이디 에러 처리
      return res.status(409).json({ message: "중복된 아이디입니다" });
    }
    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // Firebase에 사용자 생성
    const userRecord = await admin.auth().createUser({
      email: userId,
      password: password,
    });

    // MySQL Users 테이블에 유저 정보 저장
    await connection.execute(
      "INSERT INTO Users (user_id, local_id, password, name, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)",
      [userRecord.uid, userId, hashedPassword, userId]
    );

    // 기본 폴더 생성
    await createDefaultFolder(userRecord.uid, connection);

    res.status(200).json({
      message: "User registered successfully",
      uid: userRecord.uid,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  } finally {
    connection.release();
  }
};

// 2. 소셜 회원가입
exports.registerWithSocial = async (req, res) => {
  const { idToken, accessToken, uid, provider } = req.body;
  let email, name, profileImage;
  const connection = await db.getConnection();

  try {
    // 사용자가 DB에 존재하는지 확인
    const [rows] = await connection.execute(
      "SELECT * FROM Users WHERE user_id = ?",
      [uid]
    );

    if (rows.length === 0) {
      if (provider === "google") {
        // Google 인증 처리
        // const decodedToken = await admin.auth().verifyIdToken(idToken);
        const userRecord = await admin.auth().getUser(uid);
        email = userRecord.email;
        name = userRecord.displayName;
        profileImage = userRecord.photoURL;
      } else if (provider === "kakao") {
        // Kakao 인증 처리
        const kakaoUserInfo = await axios.get(
          "https://kapi.kakao.com/v2/user/me",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        uid = `kakao_${kakaoUserInfo.data.id}`;
        email = kakaoUserInfo.data.kakao_account.email;
        const customToken = await admin.auth().createCustomToken(uid);
      } else if (provider === "naver") {
        // Naver 인증 처리
        const naverUserInfo = await axios.get(
          "https://openapi.naver.com/v1/nid/me",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        uid = `naver_${naverUserInfo.data.response.id}`;
        email = naverUserInfo.data.response.email;
        const customToken = await admin.auth().createCustomToken(uid);
      }

      // Firebase Custom Token 생성

      // 데이터베이스에 사용자 정보 저장
      await connection.execute(
        "INSERT INTO Users (user_id, password, email, name, provider, profile_picture, created_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP) ON DUPLICATE KEY UPDATE email = VALUES(email), provider = VALUES(provider), profile_picture = VALUES(profile_picture);",
        [uid, uid, email, name, provider, profileImage]
      );

      // 기본 폴더 생성
      await createDefaultFolder(uid, connection);
    }
    res
      .status(200)
      .json({ message: `${provider} user authenticated`, customToken });
  } catch (error) {
    console.error(`Error authenticating ${provider} user:`, error);
    res.status(500).json({
      message: `Error authenticating ${provider} user`,
      error: error.message,
    });
  } finally {
    connection.release(); // 연결 해제
  }
};
