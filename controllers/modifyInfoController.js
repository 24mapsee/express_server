const db = require('../models/db');  // 데이터베이스 연결 파일

// 사용자 정보 수정 함수
exports.modifyUserInfo = async (req, res) => {
    const { userId } = req.params; // URL 파라미터에서 userId 가져오기
    const { name, phone_number, birth_date, gender } = req.body; // 수정할 필드들 가져오기
    try {
        // 사용자 정보 업데이트
        const [result] = await db.query(`
            UPDATE Users
            SET 
                name = ?,
                phone_number = ?,
                birth_date = ?,
                bio = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE 
                user_id = ?
        `, [name, phone_number, birth_date, gender, userId]);

        // 업데이트 성공 여부 확인
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found or no changes made" });
        }

        res.status(200).json({ message: "User information updated successfully" });
    } catch (error) {
        console.error("Error updating user information:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
