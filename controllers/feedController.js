// controllers/feedController.js
const db = require("../models/db");
const { uploadImageToS3 } = require("./imageController"); // 이미지 업로드 함수 불러오기
const multer = require("multer");

const upload = multer();

// 피드에 장소 또는 경로 공유
exports.shareToFeed = async (req, res) => {
  const { user_id, place_id, route_id, title, description } = req.body;
  let imageUrl = req.body.image_url || null;

  try {
    // 이미지 파일이 있으면 업로드 수행
    if (req.file) {
      imageUrl = await uploadImageToS3(req.file); // 클라우드에 이미지 업로드 후 URL 반환
    }

    // DB에 피드 저장
    const result = await db.execute(
      "INSERT INTO Feeds (user_id, place_id, route_id, title, description, image_url) VALUES (?, ?, ?, ?, ?, ?)",
      [
        user_id,
        place_id || null,
        route_id || null,
        title,
        description,
        imageUrl,
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

// 이미지 업로드 미들웨어
exports.uploadFeedImage = upload.single("image");

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
        Feeds.place_id, 
        Feeds.route_id,
        Users.user_id,
        Users.name,  
        Users.profile_picture,
        COUNT(Saved_Feeds.saved_feed_id) AS like_count, -- 저장(좋아요) 수 계산
        MAX(CASE WHEN Saved_Feeds.user_id = ? THEN 1 ELSE 0 END) AS is_liked -- 해당 사용자가 저장했는지 확인
      FROM Feeds
      LEFT JOIN Users ON Feeds.user_id = Users.user_id
      LEFT JOIN Saved_Feeds ON Feeds.feed_id = Saved_Feeds.feed_id
    `;

    const params = [user_id]; // 쿼리 파라미터 배열

    // 팔로잉한 사용자만 보기 옵션이 있을 때만 Following 테이블을 JOIN
    if (followingOnly) {
      query += `
        LEFT JOIN Following ON Feeds.user_id = Following.following_id
        WHERE Following.follower_id = ?
      `;
      params.push(user_id); // 팔로잉한 사용자의 ID를 파라미터로 추가
    }

    query += `GROUP BY Feeds.feed_id ORDER BY Feeds.created_at DESC`;

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

// 피드 정보 상세 불러오기
exports.getFeedDetail = async (req, res) => {
  const { feed_id } = req.query; // Query parameter로 feed_id 가져오기
  const { user_id } = req.body; // 사용자의 ID 가져오기

  try {
    // feed_id에 해당하는 피드 정보, 작성자 정보 및 경로 정보를 가져오고 저장 수 및 좋아요 여부를 확인
    const [feedDetails] = await db.query(
      `
      SELECT 
        f.*,                             -- Feeds 테이블의 모든 칼럼을 가져옵니다
        u.user_id AS author_user_id,     -- 작성자의 user_id
        u.profile_picture AS author_profile_picture,  -- 작성자의 프로필 사진
        u.name AS author_username,   -- 작성자의 사용자 이름
        r.*,                             -- Routes 테이블의 모든 칼럼을 가져옵니다
        COUNT(Saved_Feeds.saved_feed_id) AS like_count, -- 저장(좋아요) 수 계산
        MAX(CASE WHEN Saved_Feeds.user_id = ? THEN 1 ELSE 0 END) AS is_liked -- 해당 사용자가 저장했는지 확인
      FROM 
        Feeds f
      LEFT JOIN 
        Users u ON f.user_id = u.user_id   -- Feeds와 Users를 작성자 user_id 기준으로 조인
      LEFT JOIN 
        Routes r ON f.route_id = r.route_id  -- Feeds와 Routes를 route_id 기준으로 조인
      LEFT JOIN 
        Saved_Feeds ON f.feed_id = Saved_Feeds.feed_id -- Feeds와 Saved_Feeds를 feed_id 기준으로 조인
      WHERE 
        f.feed_id = ?                      -- 특정 feed_id에 해당하는 피드 조회
      GROUP BY 
        f.feed_id
    `,
      [user_id, feed_id]
    );

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

// 피드 저장 함수
exports.savePost = async (req, res) => {
  const { user_id, feed_id } = req.body; // 클라이언트에서 보낸 user_id와 feed_id 가져오기

  try {
    // saved_at 컬럼에 현재 시간을 자동으로 추가하여 Saved_Feeds 테이블에 저장
    await db.execute(
      "INSERT INTO Saved_Feeds (user_id, feed_id, saved_at) VALUES (?, ?, NOW())",
      [user_id, feed_id]
    );

    res.status(201).json({
      message: "게시물이 성공적으로 저장되었습니다.",
    });
  } catch (error) {
    console.error("게시물을 저장하는 중 오류 발생:", error);
    res.status(500).json({
      message: "게시물을 저장하는 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
};

// 저장된 피드 삭제 함수
exports.deleteSavedPost = async (req, res) => {
  const { user_id, feed_id } = req.body; // 클라이언트에서 보낸 user_id와 feed_id 가져오기

  try {
    // Saved_Feeds 테이블에서 삭제
    await db.execute(
      "DELETE FROM Saved_Feeds WHERE user_id = ? AND feed_id = ?",
      [user_id, feed_id]
    );

    res.status(200).json({
      message: "게시물이 성공적으로 삭제되었습니다.",
    });
  } catch (error) {
    console.error("게시물을 삭제하는 중 오류 발생:", error);
    res.status(500).json({
      message: "게시물을 삭제하는 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
};