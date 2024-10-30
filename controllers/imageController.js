// controllers/imageController.js
require("dotenv").config();
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const S3 = new AWS.S3({
  endpoint: new AWS.Endpoint(process.env.IMAGE_ENDPOINT),
  region: "kr-standard",
  credentials: {
    accessKeyId: process.env.NCP_ACCESSKEY,
    secretAccessKey: process.env.NCP_SECRETACCESSKEY,
  },
});

// 이미지 업로드 함수
async function uploadImageToS3(file) {
  const fileExtension = path.extname(file.originalname); // 파일 확장자 추출
  const imageName = `${uuidv4()}${fileExtension}`; // 고유 이미지 이름에 확장자 추가
  
  await S3.putObject({
    Bucket: process.env.IMAGE_BUCKET,
    Key: imageName,
    ACL: "public-read",
    Body: file.buffer,
    ContentType: file.mimetype, // 파일의 MIME 타입 설정
  }).promise();

  return `${process.env.IMAGE_ENDPOINT}/${process.env.IMAGE_BUCKET}/${imageName}`;
}

module.exports = { uploadImageToS3 };
