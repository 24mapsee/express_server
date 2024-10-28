// controllers/feedController.js
const db = require("../models/db");

// 피드에 장소 또는 경로 공유
exports.shareToFeed = async (req, res) => {
  const { user_id, place_id, route_id, title, description, image_url } =
    req.body;

  try {
    // 피드에 장소 또는 경로 저장
    const result = await db.execute(
      "INSERT INTO Feed (user_id, place_id, route_id, title, description, image_url) VALUES (?, ?, ?, ?, ?, ?)",
      [
        user_id,
        place_id || null,
        route_id || null,
        title,
        description,
        image_url,
      ]
    );

    res.status(201).json({
      message: "Post shared to feed successfully",
      feed_id: result.insertId, // 생성된 피드 ID 반환
    });
  } catch (error) {
    console.error("Error sharing post to feed:", error);
    res.status(500).json({
      message: "Error sharing post to feed",
      error: error.message,
    });
  }
};

// 모든 피드 조회
exports.getFeed = async (req, res) => {
  const { user_id, followingOnly } = req.body; // 로그인한 사용자 ID와 팔로잉만 보기 옵션

  try {
    let query = `
      SELECT 
        Feeds.feed_id, 
        Feeds.title, 
        Feeds.description, 
        Feeds.image_url, 
        Feeds.created_at, 
        
        Users.user_id, 
        Users.profile_picture
        
      FROM Feeds
      LEFT JOIN Users ON Feeds.user_id = Users.user_id
    `;

    const params = []; // 쿼리 파라미터 배열

    // 팔로잉한 사용자만 보기 옵션이 있을 때만 Following 테이블을 JOIN
    if (followingOnly) {
      query += `
        LEFT JOIN Following ON Feeds.user_id = Following.following_id
        WHERE Following.follower_id = ?
      `;
      params.push(user_id); // 팔로잉한 사용자의 ID를 파라미터로 추가
    }

    query += `ORDER BY Feeds.created_at DESC`;

    // 쿼리 실행
    const [feedItems] = await db.execute(query, params);

    res.status(200).json({
      message: "Feed retrieved successfully",
      feedItems: feedItems,
    });
  } catch (error) {
    console.error("Error retrieving feed:", error);
    res.status(500).json({
      message: "Error retrieving feed",
      error: error.message,
    });
  }
};

// 모든 Feed 조회 테스트
exports.getFeedTest = async (req, res) => {
  try {
    // Feed 테이블에서 모든 피드 항목 조회
    const [feedItems] = await db.execute(`
            SELECT *
            FROM Feeds
        `);

    res.status(200).json({
      message: "Feed retrieved successfully",
      feedItems: feedItems,
    });
  } catch (error) {
    console.error("Error retrieving feed:", error);
    res.status(500).json({
      message: "Error retrieving feed",
      error: error.message,
    });
  }
};
