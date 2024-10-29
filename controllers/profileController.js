const db = require('../models/db');  // 데이터베이스 연결 파일

// 사용자 프로필 조회 함수
exports.getUserProfile = async (req, res) => {
    const { userId } = req.params;  // URL 파라미터에서 userId 가져오기
    console.log("Requested userId:", userId);

    try {
        // 사용자 정보, 저장소(피드 수), 팔로잉 수, 팔로워 수, 찜 수를 조회
        const [userInfo] = await db.query(`
            SELECT 
                u.user_id, 
                u.profile_picture,
                (SELECT COUNT(*) FROM Feeds WHERE user_id = ?) AS repository,
                (SELECT COUNT(*) FROM Following WHERE user_id = ?) AS following,
                (SELECT COUNT(*) FROM Following WHERE following_id = ?) AS follower,
                (SELECT COUNT(*) FROM Saved_Feeds WHERE user_id = ?) AS saved_feeds
            FROM 
                Users u
            WHERE 
                u.user_id = ?
        `, [userId, userId, userId, userId, userId]);

        // 사용자 정보를 찾지 못한 경우
        if (userInfo.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // 유저의 저장된 장소 목록 조회
        const [places] = await db.query(`
            SELECT name, description 
            FROM Places
            WHERE user_id = ?
        `, [userId]);

        // 유저의 저장된 경로 목록 조회
        const [routes] = await db.query(`
            SELECT title
            FROM Custom_Routes
            WHERE user_id = ?
        `, [userId]);

        // 유저가 저장한 피드 목록 조회 (Saved_Feeds와 Feeds 테이블 조인)
        const [savedFeeds] = await db.query(`
            SELECT f.title 
            FROM Feeds f
            JOIN Saved_Feeds sf ON f.feed_id = sf.feed_id
            WHERE sf.user_id = ?
        `, [userId]);

        // 최종 JSON 응답
        res.status(200).json({
            userInfo: userInfo[0],
            places,
            routes,
            savedFeeds
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
