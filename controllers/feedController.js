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
  // feed 상세 정보 확인 ex) localhost:3000/feed/get-feed-detail?feed_id=2
};exports.getFeedDetail = async (req, res) => {
  const { feed_id } = req.query;  // Query parameter로 feed_id 가져오기

  try {
    // feed_id에 해당하는 피드 정보, 작성자 정보 및 경로 정보를 함께 가져오는 쿼리
    const [feedDetails] = await db.query(`
      SELECT 
        f.*,                             -- Feeds 테이블의 모든 칼럼을 가져옵니다
        u.user_id AS author_user_id,     -- 작성자의 user_id
        u.profile_picture AS author_profile_picture,  -- 작성자의 프로필 사진
        u.name AS author_username,   -- 작성자의 사용자 이름
        r.*                              -- Routes 테이블의 모든 칼럼을 가져옵니다
      FROM 
        Feeds f
      LEFT JOIN 
        Users u ON f.user_id = u.user_id   -- Feeds와 Users를 작성자 user_id 기준으로 조인
      LEFT JOIN 
        Routes r ON f.route_id = r.route_id  -- Feeds와 Routes를 route_id 기준으로 조인
      WHERE 
        f.feed_id = ?                      -- 특정 feed_id에 해당하는 피드 조회
    `, [feed_id]);

    // 피드를 찾지 못한 경우
    if (feedDetails.length === 0) {
      return res.status(404).json({ message: "Feed not found" });
    }

    res.status(200).json({
      message: "Feed details retrieved successfully",
      feedDetails: feedDetails[0],
    });
  } catch (error) {
    console.error("Error fetching feed details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
