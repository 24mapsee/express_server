const db = require('../models/db');  // 데이터베이스 연결 파일

// 사용자의 팔로워 목록 조회
exports.getFollowers = async (req, res) => {
    const { userId } = req.params;

    try {
        const [following] = await db.query(`
            SELECT 
                u.user_id,
                u.profile_picture,
                u.name
            FROM 
                Following f
            JOIN 
                Users u ON f.follower_id = u.user_id
            WHERE 
                f.following_id = ?
        `, [userId]);

        res.status(200).json({
            message: "Followers retrieved successfully",
            following
        });
    } catch (error) {
        console.error("Error fetching followers:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

// 사용자의 팔로잉 목록 조회
exports.getFollowing = async (req, res) => {
    const { userId } = req.params;

    try {
        const [followers] = await db.query(`
            SELECT 
                u.user_id,
                u.profile_picture,
                u.name
            FROM 
                Following f
            JOIN 
                Users u ON f.following_id = u.user_id
            WHERE 
                f.follower_id = ?
        `, [userId]);

        res.status(200).json({
            message: "Following retrieved successfully",
            followers
        });
    } catch (error) {
        console.error("Error fetching following:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

// 팔로우 관계 추가 함수 (중복 방지)
exports.addFollow = async (req, res) => {
    const { followerId, followingId } = req.body;

    try {
        // 이미 존재하는 팔로우 관계 확인
        const [existingFollow] = await db.execute(`
            SELECT * FROM Following WHERE follower_id = ? AND following_id = ?
        `, [followerId, followingId]);

        // 팔로우 관계가 이미 존재하는 경우
        if (existingFollow.length > 0) {
            return res.status(409).json({ message: "Follow relationship already exists" });
        }

        // 팔로우 관계 추가
        await db.execute(`
            INSERT INTO Following (follower_id, following_id)
            VALUES (?, ?)
        `, [followerId, followingId]);

        res.status(201).json({ message: "Follow added successfully" });
    } catch (error) {
        console.error("Error adding follow:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
// 팔로우 관계 삭제 함수
exports.deleteFollow = async (req, res) => {
    const { followerId, followingId } = req.body;

    try {
        // 팔로우 관계 삭제
        await db.execute(`
            DELETE FROM Following WHERE follower_id = ? AND following_id = ?
        `, [followerId, followingId]);

        res.status(200).json({ message: "Follow deleted successfully" });
    } catch (error) {
        console.error("Error deleting follow:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};