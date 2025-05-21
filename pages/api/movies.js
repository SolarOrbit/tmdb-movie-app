// pages/api/movies.js
export default async function handler(req, res) {
  const TMDB_API_KEY = process.env.TMDB_API_KEY;
  const page = req.query.page || 1;

  // --- 디버깅 로그 추가 ---
  console.log('[API Route] TMDB_API_KEY from process.env:', TMDB_API_KEY); // 1. API 키가 제대로 로드되는지 확인

  const tmdbURL = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=ko-KR&page=${page}`;
  console.log('[API Route] Requesting URL:', tmdbURL); // 2. TMDB로 요청할 전체 URL 확인

  try {
    const response = await fetch(tmdbURL);

    console.log('[API Route] TMDB Response Status:', response.status); // 3. TMDB 응답 상태 코드 확인

    if (!response.ok) {
      const errorBody = await response.text(); // TMDB의 상세 에러 메시지를 텍스트로 받아옵니다.
      console.error('[API Route] TMDB API Error Body:', errorBody); // 4. TMDB 에러 본문 확인
      throw new Error(
        `TMDB API error: ${response.status} - ${response.statusText}. Response from TMDB: ${errorBody}`
      );
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('[API Route] Catch block error:', error); // 5. 최종 에러 확인
    res.status(500).json({
        message: 'Error fetching data from TMDB',
        errorDetails: error.message, // 에러 상세 내용을 클라이언트에도 전달 (디버깅용)
        apiKeyUsed: TMDB_API_KEY ? 'Key Present (see server logs for value)' : 'Key NOT Present'
    });
  }
}