import { Cinema } from "@/interfaces/Cinema";
import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import { Movie } from "@/interfaces/Movie";
import { MovieOrderedByHour } from "@/interfaces/MovieOrderedByHour";

interface ComponentProps {
  selectedMovies: Movie[];
}

const ShowBestSchedule = ({ selectedMovies }: ComponentProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [orderedMovies, setOrderedMovies] = useState<MovieOrderedByHour[]>([]);
  const [scheduleOptions, setScheduleOptions] = useState<MovieOrderedByHour[][]>([]);

  const handleBackdropClick = (event: any) => {
    if (event.target.id === "modal-backdrop") {
      setShowModal(false);
    }
  };

  function findBestSchedule(movies: Movie[]) {
    const cloneMovies = orderMoviesByHour(movies);


    setScheduleOptions([tryCombinations(cloneMovies, 0), tryCombinations(cloneMovies, 1), tryCombinations(cloneMovies, 2)])
  }

  function orderMoviesByHour(funciones: Movie[]) {
    // Función de comparación para ordenar por hora de inicio
    const allFormats: MovieOrderedByHour[] = [];

    funciones.forEach((movieFormats: Movie) => {
      movieFormats.Formats?.forEach((showtimes: any) => {
        showtimes.Showtimes.forEach((showtime: any) => {
          allFormats.push({
            Time: showtime.Time,
            Movie: movieFormats.Title,
            RunTime: movieFormats.RunTime,
            FinishTime: addMinutes(showtime.Time, movieFormats.RunTime),
          });
        });
      });
    });

    // Función de comparación para ordenar por la propiedad "Time"
    function compareTime(a: any, b: any) {
      const timeA = a.Time;
      const timeB = b.Time;

      if (timeA < timeB) {
        return -1;
      }
      if (timeA > timeB) {
        return 1;
      }
      return 0;
    }

    // Ordenar el array de películas por la propiedad "Time"
    allFormats.sort(compareTime);

    return allFormats;
  }

  function addMinutes(time: any, minutes: any) {
    let timeArray = time.split(":");
    let minutesToAdd = minutes.split(" ");
    let addedMinutes = parseInt(minutesToAdd[0]);

    let initialHour = parseInt(timeArray[0]);
    let initialMinute = parseInt(timeArray[1]);

    if (addedMinutes >= 60) {
        let hoursToAdd = Math.floor(addedMinutes / 60);
        let remainingMinutes = addedMinutes % 60;
        initialHour += hoursToAdd;
        initialMinute += remainingMinutes;

        if (initialMinute >= 60) {
            initialHour += 1;
            initialMinute -= 60;
        }
    } else {
        initialMinute += addedMinutes;

        if (initialMinute >= 60) {
            initialHour += 1;
            initialMinute -= 60;
        }
    }

    return initialHour + ":" + initialMinute;
  }

  function tryCombinations(scheduledMovies: MovieOrderedByHour[], elementsToIgnore: number = 0) {
    let currentFinishTime = "00:00";
    let availableMovies = [...scheduledMovies];
    let bestSchedule: MovieOrderedByHour[] = [];
    let moviesAlreadyChecked: string[] = [];
    let moviesWithoutCoincidences: MovieOrderedByHour[] = [];

    availableMovies.slice(elementsToIgnore).forEach((movie: MovieOrderedByHour) => {
      if (!moviesAlreadyChecked.includes(movie.Movie)) {
        if (movie.Time > currentFinishTime) {
          moviesWithoutCoincidences.push(movie);
          currentFinishTime = movie.FinishTime;
          moviesAlreadyChecked.push(movie.Movie);
        }
      }
    })

    return moviesWithoutCoincidences
  }

  useEffect(() => {
    if (selectedMovies && selectedMovies.length > 0) {
      findBestSchedule(selectedMovies);
    }
  }, [selectedMovies])

  return (
    <>
      <button
        onClick={() => setShowModal((prevState) => !prevState)}
        className="btn btn-dark-mode w-full"
      >
        Horarios
      </button>

      {showModal && (
        <div
          onClick={(event: any) => handleBackdropClick(event)}
          id="modal-backdrop"
          className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-50 flex items-center justify-center p-8"
        >
          <div className="bg-white min-w-72 max-w-2xl p-4 rounded-2xl shadow overflow-y-auto">
            <h2 className="text-xl font-bold text-center">Mejores horarios</h2>

            <div className="grid grid-cols-1 gap-4">
              {
                scheduleOptions.length > 0 && scheduleOptions.map((schedule: MovieOrderedByHour[], index: number) => (
                  <div key={index} className="bg-red-200">
                    {schedule.map((movie: MovieOrderedByHour, index: number) => (
                      <div key={index} className="bg-blue-300">
                        <p>{movie.Movie}</p>
                        <p>{movie.Time} - {movie.FinishTime}</p>
                      </div>
                    ))}
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShowBestSchedule;
