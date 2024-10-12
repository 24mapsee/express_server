const axios = require('axios');

const apiKey = encodeURIComponent(process.env.ODSAY_API_KEY);  // API 키를 URL 인코딩합니다.

async function findTransitRoutes(sx, sy, ex, ey) {
  const url = `https://api.odsay.com/v1/api/searchPubTransPathT?SX=${sx}&SY=${sy}&EX=${ex}&EY=${ey}&apiKey=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    
    console.log('ODsay API Response:', data);  // 응답 데이터 출력

    if (data.error) {
      throw new Error('Invalid response from ODsay API');
    }

    return data.result ? data.result.path[0] : null;
  } catch (error) {
    console.error('Transit route finding error:', error.message);
    throw new Error('Failed to fetch route data');
  }
}

module.exports = findTransitRoutes;
