"use client";
import { useEffect, useState } from "react";
import { getMoviesFromCinemaAndDate } from "./scrap.js";
import { get } from "http";
import { Cinema } from "@/interfaces/Cinema.js";
import { MovieOrderedByHour } from "@/interfaces/MovieOrderedByHour.js";
import SelectCinema from "@/components/SelectCinema";
import SelectDate from "@/components/SelectDate";
import MovieCard from "@/components/MovieCard";
import { Movie } from "@/interfaces/Movie";
import ShowBestSchedule from "@/components/ShowBestSchedule";

async function getMoviesFromCinemaAndDateAsync(cinema: string, date: string) {
  const movies = await getMoviesFromCinemaAndDate(cinema, date);

  return movies;
}

export default function Home() {
  const [cinema, setCinema] = useState<string>("cinepolis-centro-magno");
  const [selectedDate, setSelectedDate] = useState<string>("01 enero");
  const [movies, setMovies] = useState<Cinema[]>([]);
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);
  const [orderedMovies, setOrderedMovies] = useState<MovieOrderedByHour[]>([]);
  const [currentFinishTime, setCurrentFinishTime] = useState<string>("00:00");

  useEffect(() => {
    async function getMovies() {
      const movies = await getMoviesFromCinemaAndDateAsync(
        cinema,
        selectedDate
      );


      setMovies(movies);
    }

    getMovies();
  }, [cinema, selectedDate]);

  const addSelectedMovie = (movie: any) => {
    // Verificar si la película ya está en el arreglo
    const movieExists = selectedMovies.some(
      (selectedMovie: any) => selectedMovie.Id === movie.Id
    );
  
    if (!movieExists) {
      // Si la película no existe, agregarla al arreglo
      setSelectedMovies((prevState: any) => [...prevState, movie]);
    } else {
      // Si la película ya existe, eliminarla del arreglo
      const updatedMovies = selectedMovies.filter(
        (selectedMovie: any) => selectedMovie.Id !== movie.Id
      );
      setSelectedMovies(updatedMovies);
    }
  };
  

  const isMovieSelected = (movie: any) => {
    const foundMovie = selectedMovies.find(
      (selectedMovie: any) => selectedMovie.Id === movie.Id
    )

    return foundMovie ? true : false;
  };

  function obtenerPelisSinCoincidencias(peliculas: any) {
    // Ordenar las películas por hora de inicio
    peliculas.sort((a: any, b: any) => (a.Time > b.Time ? 1 : -1));

    // Array para almacenar las películas sin coincidencias
    let peliculasSinCoincidencias = [];

    // Iterar sobre las películas y verificar la no coincidencia
    for (let i = 0; i < peliculas.length - 1; i++) {
      const peliculaActual = peliculas[i];
      const peliculaSiguiente = peliculas[i + 1];

      // Obtener la hora de finalización de la película actual y la hora de inicio de la siguiente
      const finishTimeActual = new Date(
        `01/01/2000 ${peliculaActual.FinishTime}`
      );
      const startTimeSiguiente = new Date(
        `01/01/2000 ${peliculaSiguiente.Time}`
      );

      // Verificar si no hay coincidencia en el horario
      if (finishTimeActual < startTimeSiguiente) {
        peliculasSinCoincidencias.push(peliculaActual);
      }
    }

    // Agregar la última película a la lista sin verificar, ya que no hay siguiente película
    peliculasSinCoincidencias.push(peliculas[peliculas.length - 1]);

    return peliculasSinCoincidencias;
  }

  function isWatchingTimeAvailable(time: any) {
    if (time > currentFinishTime) {
      return true;
    }

    return false;
  }

  return (
    <div className="">
      <section className="border border-black dark:border-white flex flex-col items-center justify-center fixed bottom-0 left-0 bg-white dark:bg-black w-screen p-2">
        <div className="flex flex-col md:flex-row gap-2">
          <SelectCinema
            cinemaKey={cinema}
            changeCinema={(value: string) => setCinema(value)}
          />
          <SelectDate
            cinemaKey={cinema}
            selectedDate={selectedDate}
            changeDate={(value: string) => setSelectedDate(value)}
          />
          <div className="flex gap-2">
            <button onClick={() => setSelectedMovies([])} className="btn btn-dark-mode w-full">
              Resetear
            </button>
            <ShowBestSchedule
              selectedMovies={selectedMovies}
            />
          </div>
        </div>
      </section>

      <main className="max-w-2xl p-4 pb-12 mx-auto bg-white dark:bg-dark">
        <div className="grid grid-cols-1 gap-4">
          {movies &&
            movies.length > 0 &&
            movies.map((movie: any) => (
              <MovieCard 
                key={movie.Id}
                movie={movie}
                addSelectedMovie={(movie: Movie) => addSelectedMovie(movie)}
                isMovieSelected={(movie: Movie) => isMovieSelected(movie)}
              />
            ))}
        </div>
      </main>
    </div>
  );
}
