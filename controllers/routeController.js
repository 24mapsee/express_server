const db = require("../models/db");

// 경로 저장 함수
exports.saveRoute = async (req, res) => {
  const { title, description, user_id, routes } = req.body;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Custom_Routes 테이블에 경로 정보 저장
    const [customRouteResult] = await connection.execute(
      "INSERT INTO Custom_Routes (title, description, user_id, created_at, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
      [title, description, user_id]
    );

    const custom_route_id = customRouteResult.insertId;

    for (const route of routes) {
      await connection.execute(
        "INSERT INTO Routes (custom_route_id, startY, startX, endY, endX, startName, endName, created_at, updated_at, user_id, `data`) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?, ?)",
        [
          custom_route_id,
          route.startY,
          route.startX,
          route.endY,
          route.endX,
          route.startName,
          route.endName,
          user_id,
          route.data,
        ]
      );
    }

    await connection.commit();

    res.status(201).json({
      message: "Route saved successfully",
      custom_route_id: custom_route_id,
    });
  } catch (error) {
    await connection.rollback();

    console.error("Error saving route:", error);
    res.status(500).json({
      message: "Error saving route",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

exports.getRoutes = async (req, res) => {
  try {
    const [routes] = await db.execute(`
      SELECT cr.custom_route_id, cr.title, cr.description, cr.created_at,
             r.route_id, r.startY, r.startX, r.endY, r.endX, r.startName, r.endName, r.data
      FROM Custom_Routes cr
      LEFT JOIN Routes r ON cr.custom_route_id = r.custom_route_id
      ORDER BY cr.created_at DESC
    `);

    res.status(200).json({
      message: "Routes retrieved successfully",
      routes: routes,
    });
  } catch (error) {
    console.error("Error retrieving routes:", error);
    res.status(500).json({
      message: "Error retrieving routes",
      error: error.message,
    });
  }
};
