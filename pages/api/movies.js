// pages/api/movies.js
export default async function handler(req, res) {
  const { page = 1 } = req.query; // 기본값을 1로 설정하고, req.query에서 직접 가져옴
  const TMDB_API_KEY = process.env.TMDB_API_KEY;

  console.log(`[API_ROUTE] Request received for /api/movies. Requested page: ${page}`);

  if (!TMDB_API_KEY) {
    console.error('[API_ROUTE] CRITICAL: TMDB_API_KEY is not set in environment variables.');
    return res.status(500).json({ message: 'Server configuration error: TMDB API Key not found.' });
  }
  // console.log('[API_ROUTE] TMDB_API_KEY successfully loaded from environment variables.'); // 너무 자주 로깅될 수 있어 주석 처리 또는 필요시 활성화

  const tmdbURL = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=ko-KR&page=${page}`;
  console.log(`[API_ROUTE] Preparing to call TMDB API. URL: ${tmdbURL}`);

  try {
    const tmdbResponse = await fetch(tmdbURL);
    console.log(`[API_ROUTE] TMDB API call completed. Response status: ${tmdbResponse.status}`);

    if (!tmdbResponse.ok) {
      const errorBody = await tmdbResponse.text();
      console.error(`[API_ROUTE] Error response from TMDB API. Status: ${tmdbResponse.status}, Body: ${errorBody}`);
      // 클라이언트에게 너무 상세한 TMDB 오류를 직접 노출하지 않도록 일반적인 메시지로 응답할 수 있습니다.
      // 하지만 디버깅을 위해 여기서는 상세 내용을 포함합니다.
      return res.status(tmdbResponse.status).json({
        message: `Failed to fetch data from TMDB. Status: ${tmdbResponse.status}`,
        tmdb_error: errorBody,
      });
    }

    const data = await tmdbResponse.json();
    console.log(`[API_ROUTE] Successfully fetched and parsed data from TMDB. Number of movies: ${data.results ? data.results.length : 0}`);

    res.status(200).json(data);
    console.log(`[API_ROUTE] Successfully sent ${data.results ? data.results.length : 0} movies to the client.`);
  } catch (error) {
    console.error(`[API_ROUTE] Internal error in /api/movies handler: ${error.message}`, error);
    res.status(500).json({
        message: 'Internal server error while processing movie data.',
        errorDetails: error.message // 개발 중에는 상세 내용을 보내는 것이 유용
    });
  }
}