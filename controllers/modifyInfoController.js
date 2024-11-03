const db = require("../models/db"); // 데이터베이스 연결 파일
const admin = require("../models/firebase"); // Firebase Admin SDK

// 사용자 정보 수정 함수
exports.updateUserTableData = async (req, res) => {
  const { idToken, userData } = req.body; // Expecting userData to contain the fields to update

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;
    console.log("Updating userId (Firebase UID):", userId);

    if (!userData || !userData.email || !userData.name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // SQL query to update user information
    const result = await db.query(
      `
          UPDATE Users 
          SET 
            profile_picture = ?, 
            bio = ?, 
            provider = ?, 
            local_id = ?, 
            name = ?, 
            phone_number = ?, 
            birth_date = ?
            updated_at = CURRENT_TIMESTAMP
          WHERE 
            user_id = ?
        `,
      [
        userData.profile_picture,
        userData.bio,
        userData.provider,
        userData.local_id,
        userData.name,
        userData.phone_number,
        userData.birth_date,
        userId,
      ]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "User not found or no changes made" });
    }

    res.status(200).json({ message: "User profile updated successfully" });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.modifyUserInfo = async (req, res) => {
  const { userId } = req.params; // URL 파라미터에서 userId 가져오기
  const { name, phone_number, birth_date, bio, email } = req.body; // 수정할 필드들 가져오기
  try {
    // 사용자 정보 업데이트
    const [result] = await db.query(
      `
            UPDATE Users
            SET 
                name = ?,
                phone_number = ?,
                birth_date = ?,
                bio = ?,
                email = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE 
                user_id = ?
        `,
      [name, phone_number, birth_date, bio, email, userId]
    );

    // 업데이트 성공 여부 확인
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "User not found or no changes made" });
    }

    res.status(200).json({ message: "User information updated successfully" });
  } catch (error) {
    console.error("Error updating user information:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
