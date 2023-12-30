import { Movie } from "@/interfaces/Movie";

interface ComponentProps {
  movie: Movie;
  addSelectedMovie: (movie: Movie) => void;
  isMovieSelected: (movie: Movie) => boolean;
  showOnlyPoster?: boolean;
}

const MovieCard = ({
  movie,
  addSelectedMovie,
  isMovieSelected,
  showOnlyPoster = false,
}: ComponentProps) => {
  return (
    <div
      onClick={() => addSelectedMovie(movie)}
      className={`shadow dark:border-neutral-300 cursor-pointer rounded-2xl overflow-hidden flex gap-2 ${
        isMovieSelected(movie)
          ? "bg-black dark:bg-white text-white dark:text-black"
          : ""
      }`}
      key={movie.Id}
    >
      <div className="w-32">
        <img className="w-32" src={movie.Poster} alt={movie.Title} />
      </div>

      {!showOnlyPoster && (
        <div className="flex flex-col p-2 gap-2">
          <h2 className=" text-lg font-bold line-clamp-2">
            ({movie.RunTime}) - {movie.Title}
          </h2>
          {movie.Formats?.map((format: any) => (
            <div key={format.Name} className="mb-4 overflow-hidden">
              <p className="mb-2 text-xs">{format.Name}</p>
              <div className="flex gap-2">
                {format.Showtimes.map((showtime: any) => (
                  <span
                    key={showtime.Time}
                    className="border border-neutral-500 dark:border-neutral-300 rounded-full py-1 px-2 text-sm"
                  >
                    {showtime.Time}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieCard;
