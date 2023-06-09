import React, { useState, useEffect } from "react";
import "./Row.css";
import axios from "./axios";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";
import Loading from "./Loading";

const base_url = "https://image.tmdb.org/t/p/original/";
function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingVideo, setLoadingVideo] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      setLoading(false);
      return request;
    }

    fetchData();
  }, [fetchUrl]);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      setLoadingVideo(true);

      movieTrailer(movie?.name || movie?.title || "")
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
          setLoadingVideo(false);
        })
        .catch((error) => {
          setLoadingVideo(false);
          alert(`========================
          \t\tSorry! \n ========================== \n \t\tWe can not play the movie!`);
        });
    }
  };

  return (
    <div className="row">
      <h2>{title}</h2>
      {loading && <Loading style={{ marginTop: "20px" }} />}
      <div className="row__posters">
        {movies.map((movie) => (
          <>
            <img
              key={movie.id}
              onClick={() => handleClick(movie)}
              className={`row__poster ${isLargeRow && "row__posterLarge"}`}
              src={`${base_url}${
                isLargeRow ? movie.poster_path : movie.backdrop_path
              }`}
              alt={movie?.name || movie?.title}
            />
          </>
        ))}
      </div>
      {loadingVideo ? (
        <Loading />
      ) : (
        trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />
      )}
    </div>
  );
}

export default Row;
