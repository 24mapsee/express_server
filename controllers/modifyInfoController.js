const db = require("../models/db"); // 데이터베이스 연결 파일
const admin = require("../models/firebase"); // Firebase Admin SDK

// 사용자 정보 수정 함수
exports.updateUserTableData = async (req, res) => {
  const { idToken, userData } = req.body; // Expecting userData to contain the fields to update

  try {
    if (!userData || !idToken) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;
    console.log("Updating userId (Firebase UID):", userId);

    const fieldsToUpdate = [];
    const values = [];

    if (userData.profile_picture !== null) {
      fieldsToUpdate.push("profile_picture = ?");
      values.push(userData.profile_picture);
    }
    if (userData.bio !== null) {
      fieldsToUpdate.push("bio = ?");
      values.push(userData.bio);
    }
    if (userData.provider !== null) {
      fieldsToUpdate.push("provider = ?");
      values.push(userData.provider);
    }
    if (userData.local_id !== null) {
      fieldsToUpdate.push("local_id = ?");
      values.push(userData.local_id);
    }
    if (userData.name !== null) {
      fieldsToUpdate.push("name = ?");
      values.push(userData.name);
    }
    if (userData.phone_number !== null) {
      fieldsToUpdate.push("phone_number = ?");
      values.push(userData.phone_number);
    }
    if (userData.birth_date !== null) {
      fieldsToUpdate.push("birth_date = ?");
      values.push(userData.birth_date);
    }

    fieldsToUpdate.push("updated_at = CURRENT_TIMESTAMP");

    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const query = `
        UPDATE Users 
        SET 
          ${fieldsToUpdate.join(", ")}
        WHERE 
          user_id = ?
      `;

    values.push(userId);

    const result = await db.query(query, values);

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
