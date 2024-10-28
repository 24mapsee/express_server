// controllers/feedController.js
const db = require('../models'); // Assuming you have a DB model setup

// 피드에 장소 또는 경로 공유
exports.shareToFeed = async (req, res) => {
    const { user_id, place_id, route_id, title, description, image_url } = req.body;

    try {
        // 피드에 장소 또는 경로 저장
        const result = await db.execute(
            'INSERT INTO Feed (user_id, place_id, route_id, title, description, image_url) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, place_id || null, route_id || null, title, description, image_url]
        );

        res.status(201).json({
            message: 'Post shared to feed successfully',
            feed_id: result.insertId  // 생성된 피드 ID 반환
        });
    } catch (error) {
        console.error('Error sharing post to feed:', error);
        res.status(500).json({
            message: 'Error sharing post to feed',
            error: error.message
        });
    }
};

// 모든 피드 조회
exports.getFeed = async (req, res) => {
    try {
        // Feed 테이블에서 모든 피드 항목 조회
        const [feedItems] = await db.execute(`
            SELECT Feed.feed_id, Feed.title, Feed.description, Feed.image_url, Feed.created_at, 
            users.user_id, users.email, 
            Saved_Place.name AS place_name, Saved_Place.latitude, Saved_Place.longitude, 
            Routes.route_name, Routes.route_description
            FROM Feed
            LEFT JOIN users ON Feed.user_id = users.user_id
            LEFT JOIN Saved_Place ON Feed.place_id = Saved_Place.id
            LEFT JOIN Routes ON Feed.route_id = Routes.route_id
            ORDER BY Feed.created_at DESC
        `);

        res.status(200).json({
            message: 'Feed retrieved successfully',
            feedItems: feedItems
        });
    } catch (error) {
        console.error('Error retrieving feed:', error);
        res.status(500).json({
            message: 'Error retrieving feed',
            error: error.message
        });
    }
};
