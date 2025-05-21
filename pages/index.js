// pages/index.js
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // 현재 페이지 상태

  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
      setError(null);
      try {
        // API 라우트에 페이지 번호를 쿼리 파라미터로 전달합니다.
        const response = await fetch(`/api/movies?page=${page}`);
        if (!response.ok) {
          // 서버에서 에러 메시지를 json 형태로 보냈을 경우를 처리
          const errorData = await response.json().catch(() => ({ message: `HTTP error ${response.status}` }));
          throw new Error(errorData.message || `Error: ${response.status}`);
        }
        const data = await response.json();
        if (data.results) {
          setMovies(data.results);
        } else {
          setMovies([]); // 결과가 없는 경우 빈 배열로 설정
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [page]); // page 상태가 변경될 때마다 useEffect가 다시 실행됩니다.

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <p>영화를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>
        <p>오류가 발생했습니다: {error}</p>
        <p>TMDB API 키가 Vercel 환경 변수에 정확히 설정되었는지, API 할당량을 초과하지 않았는지 확인해주세요.</p>
        <p>또한, `/api/movies.js` 파일이 올바르게 작성되었는지 확인해주세요.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>인기 영화 목록 (TMDB)</h1>
      {movies.length > 0 ? (
        <ul>
          {movies.map((movie) => (
            <li key={movie.id} className="movie-item">
              <img
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : '/placeholder.png'} // 포스터 이미지가 없을 경우 대체 이미지
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
      ) : (
        <p>영화를 찾을 수 없습니다.</p>
      )}

      <div className="pagination">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || loading}>
          이전 페이지
        </button>
        <span> 현재 페이지: {page} </span>
        <button onClick={() => setPage(p => p + 1)} disabled={loading}>
          다음 페이지
        </button>
      </div>

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 20px auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        h1 {
          text-align: center;
          color: #333;
          margin-bottom: 30px;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        .movie-item {
          display: flex;
          margin-bottom: 20px;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #f9f9f9;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .movie-poster {
          width: 100px;
          height: 150px; /* 고정 높이 */
          object-fit: cover; /* 이미지 비율 유지하며 채우기 */
          border-radius: 4px;
          margin-right: 20px;
        }
        .movie-info {
          flex: 1;
        }
        .movie-info h2 {
          margin-top: 0;
          font-size: 1.2em;
          color: #0070f3; /* Next.js blue */
        }
        .movie-info p {
          font-size: 0.9em;
          color: #555;
          margin-bottom: 5px;
        }
        .overview {
          font-size: 0.8em;
          color: #666;
          line-height: 1.4;
          max-height: 60px; /* 약 3-4줄 */
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 30px;
        }
        .pagination button {
          background-color: #0070f3;
          color: white;
          border: none;
          padding: 10px 15px;
          margin: 0 10px;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .pagination button:hover:not(:disabled) {
          background-color: #005bb5;
        }
        .pagination button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        .pagination span {
          font-size: 1em;
          color: #333;
        }
      `}</style>
    </div>
  );
}