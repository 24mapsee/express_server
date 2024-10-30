const db = require("../models/db");

exports.getPlaceFolders = async (req, res) => {
    const { uid } = req.body;
  
    try {
      // Folders 테이블에서 해당 유저의 폴더 목록 조회
      const [folders] = await db.execute(`
        SELECT folder_id, folder_name, description
        FROM Place_Folders
        WHERE user_id = ?
      `, [uid]);
  
      res.status(200).json({
        message: "Folders retrieved successfully",
        folders: folders,
      });
    } catch (error) {
      console.error("Error retrieving folders:", error);
      res.status(500).json({
        message: "Error retrieving folders",
        error: error.message,
      });
    }
  };
  
 // 특정 폴더에 속한 장소 목록 불러오기
exports.getPlacesInFolder = async (req, res) => {
    const { folder_id } = req.body;
  
    try {
      // Places 테이블에서 특정 folder_id를 기준으로 장소 목록 조회
      const [places] = await db.execute(`
        SELECT place_id, name, address, latitude, longitude, description, saved_at
        FROM Places
        WHERE folder_id = ?
      `, [folder_id]);
  
      res.status(200).json({
        message: "Places in folder retrieved successfully",
        folder_id: folder_id,
        places: places,
      });
    } catch (error) {
      console.error("Error retrieving places in folder:", error);
      res.status(500).json({
        message: "Error retrieving places in folder",
        error: error.message,
      });
    }
  };
  
  // 특정 폴더에 장소 저장
exports.addPlaceToFolder = async (req, res) => {
    const { folder_id, name, address, latitude, longitude, description } = req.body;

    try {
        await db.execute(`
            INSERT INTO Places (folder_id, name, address, latitude, longitude, description, saved_at)
            VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `, [folder_id, name, address, latitude, longitude, description]);

        res.status(201).json({
            message: "Place added to folder successfully"
        });
    } catch (error) {
        console.error("Error adding place to folder:", error);
        res.status(500).json({
            message: "Error adding place to folder",
            error: error.message,
        });
    }
};

// 새로운 폴더 생성
exports.createFolder = async (req, res) => {
    const { user_id, folder_name } = req.body;

    try {
        // Place_Folders 테이블에 새로운 폴더 추가
        await db.execute(`
            INSERT INTO Place_Folders (user_id, folder_name, created_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)
        `, [user_id, folder_name]);

        res.status(201).json({
            message: "Folder created successfully"
        });
    } catch (error) {
        console.error("Error creating folder:", error);
        res.status(500).json({
            message: "Error creating folder",
            error: error.message,
        });
    }
};