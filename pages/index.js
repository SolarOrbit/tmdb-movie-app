// pages/index.js
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // 페이지 컴포넌트가 마운트되거나 'page' 상태가 변경될 때 실행
    console.log(`[FRONTEND] HomePage useEffect triggered. Current page: ${page}. Initializing movie fetch process.`);

    async function fetchMovies() {
      setLoading(true);
      setError(null);
      console.log(`[FRONTEND] Attempting to fetch movies for page: ${page} from /api/movies`);
      try {
        const response = await fetch(`/api/movies?page=${page}`);
        console.log(`[FRONTEND] API call to /api/movies?page=${page} sent. Waiting for response.`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: `HTTP error ${response.status}` }));
          console.error(`[FRONTEND] API call to /api/movies FAILED. Status: ${response.status}, Message: ${errorData.message}`);
          throw new Error(errorData.message || `Error: ${response.status}`);
        }

        const data = await response.json();
        console.log(`[FRONTEND] Successfully received data from /api/movies. Number of movies: ${data.results ? data.results.length : '0'}`);
        if (data.results) {
          setMovies(data.results);
        } else {
          setMovies([]);
        }
      } catch (err) {
        console.error(`[FRONTEND] Error during fetchMovies function: ${err.message}`);
        setError(err.message);
      } finally {
        setLoading(false);
        console.log(`[FRONTEND] Movie fetch process for page ${page} finished. Loading state: ${false}`);
      }
    }

    fetchMovies();
  }, [page]); // page가 변경될 때마다 실행

  // 로딩 및 에러 UI
  if (loading) {
    console.log("[FRONTEND] Rendering: Loading state UI");
    return <p>영화를 불러오는 중...</p>;
  }
  if (error) {
    console.error("[FRONTEND] Rendering: Error state UI with message -", error);
    return <p>오류: {error}</p>;
  }

  // 영화 목록 UI
  console.log("[FRONTEND] Rendering: Movie list UI with", movies.length, "movies.");
  return (
    <div className="container">
      <h1>인기 영화 목록 (TMDB) - 페이지 {page}</h1>
      {/* ... (이하 기존 JSX 렌더링 코드와 동일) ... */}
      <ul>
        {movies.map((movie) => (
          <li key={movie.id} className="movie-item">
            <img
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : '/placeholder.png'}
              alt={movie.title}
              className="movie-poster"
            />
            <div className="movie-info">
              <h2>{movie.title} ({movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'})</h2>
              <p>평점: {movie.vote_average} (TMDb)</p>
              <p className="overview">{movie.overview || "줄거리가 제공되지 않았습니다."}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="pagination">
        <button onClick={() => { console.log('[FRONTEND] Clicked: Previous Page button'); setPage(p => Math.max(1, p - 1)); }} disabled={page === 1 || loading}>
          이전 페이지
        </button>
        <span> 현재 페이지: {page} </span>
        <button onClick={() => { console.log('[FRONTEND] Clicked: Next Page button'); setPage(p => p + 1); }} disabled={loading}>
          다음 페이지
        </button>
      </div>
      <style jsx>{`
        /* ... (기존 스타일 코드) ... */
      `}</style>
    </div>
  );
}