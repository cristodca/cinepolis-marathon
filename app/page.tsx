"use client"
import { useEffect, useState } from 'react'
import { getMoviesFromCinemaAndDate } from './scrap.js'
import { get } from 'http'

async function getMoviesFromCinemaAndDateAsync(cinema: string, date: string) {
  const movies = await getMoviesFromCinemaAndDate(cinema, date)

  return movies
}

export default function Home() {
  const [movies, setMovies] = useState<any>([])
  const [selectedMovies, setSelectedMovies] = useState<any>([])
  const [orderedMovies, setOrderedMovies] = useState<any>([])
  const [currentFinishTime, setCurrentFinishTime] = useState<any>('00:00')
  
  useEffect(() => {
    async function getMovies() {
      const movies = await getMoviesFromCinemaAndDateAsync('cinepolis-centro-magno', '01 enero')

      setMovies(movies)
    }

    getMovies()
  }, [])

  const addSelectedMovie = (movie: any) => {
    setSelectedMovies((prevState: any) => (
      [...prevState, movie]
    ))

    console.log(selectedMovies)
  }

  const isMovieSelected = (movie: any) => {
    return selectedMovies.find((selectedMovie: any) => selectedMovie.Id === movie.Id)
  }

  function ordenarFuncionesPorHora(funciones: any[]) {
    // Función de comparación para ordenar por hora de inicio
    const allFormats: any[] = []
    
    funciones.forEach((movieFormats: any) => {
      movieFormats.Formats.forEach((showtimes: any) => {
        showtimes.Showtimes.forEach((showtime: any) => {
          allFormats.push({
            Time: showtime.Time,
            Movie: movieFormats.Title,
            RunTime: movieFormats.RunTime,
            FinishTime: sumarMinutos(showtime.Time, movieFormats.RunTime)
          })
        })
      })
    })

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

    console.log(allFormats)
    return allFormats;
  }

  function encontrarMejorProgramacion(peliculas: any) {
    // Clonar el array de películas para evitar modificar el original
    const cloneMovies = ordenarFuncionesPorHora(peliculas)


    setOrderedMovies(cloneMovies)

    // console.log('mejor opcion', obtenerPelisSinCoincidencias(cloneMovies))
    // console.log('mejor opcion', cloneMovies)
  }

  // Función para sumar minutos a una hora dada
  function sumarMinutos(hora: any, minutos: any) {
    let horaMinutos = hora.split(':');
    let minutosSumar = minutos.split(' ');
    let minutes = parseInt(minutosSumar[0]);

    let horaInicial = parseInt(horaMinutos[0]);
    let minutoInicial = parseInt(horaMinutos[1]);

    if (minutes >= 60) {
      let horas = Math.floor(minutes / 60);
      let minutos = minutes % 60;
      horaInicial += horas;
      minutoInicial += minutos;
      if (minutoInicial >= 60) {
        horaInicial += 1;
        minutoInicial -= 60;
      }      
    } else {
      minutoInicial += minutes;
      if (minutoInicial >= 60) {
        horaInicial += 1;
        minutoInicial -= 60;
      }
    }

    console.log(horaInicial + ':' + minutoInicial);
    return (horaInicial + ':' + minutoInicial);
  }

  function obtenerPelisSinCoincidencias(peliculas: any) {
    // Ordenar las películas por hora de inicio
    peliculas.sort((a: any, b: any) => (a.Time > b.Time) ? 1 : -1);

    // Array para almacenar las películas sin coincidencias
    let peliculasSinCoincidencias = [];

    // Iterar sobre las películas y verificar la no coincidencia
    for (let i = 0; i < peliculas.length - 1; i++) {
        const peliculaActual = peliculas[i];
        const peliculaSiguiente = peliculas[i + 1];

        // Obtener la hora de finalización de la película actual y la hora de inicio de la siguiente
        const finishTimeActual = new Date(`01/01/2000 ${peliculaActual.FinishTime}`);
        const startTimeSiguiente = new Date(`01/01/2000 ${peliculaSiguiente.Time}`);

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
    console.log(time, currentFinishTime)

    if (time > currentFinishTime) {
      return true
    }

    return false
  }

  return (
    <div className='flex'>
      <main className='container border p-8'>
        <div className="flex gap-4 mb-8 max-w-full overflow-x-auto">
          {
            movies && movies.length > 0 && movies.map((movie: any) => (
              <div onClick={() => addSelectedMovie(movie)} className={`border rounded p-4 ${isMovieSelected(movie) ? 'border-green-600' : ''}`} key={movie.Id}>
                {movie.Title}
              </div>
            ))
          }
        </div>


        <div className="grid grid-cols-1 gap-8">
          {selectedMovies && selectedMovies.length > 0 && selectedMovies.map((movie: any) => (
            <div className='border rounded p-4 flex gap-2' key={movie.Id}>
              <div>
                <img src={movie.Poster} alt={movie.Title} />
              </div>
              <div className="flex flex-col p-2 gap-2">
                <h2 className='text-2xl font-bold'>({movie.RunTime}) - {movie.Title}</h2>
                  {
                    movie.Formats.map((format: any) => (
                      <div className='mb-4'>
                        <p className='mb-2'>{format.Name}</p>
                        <div className="flex gap-2">
                          {format.Showtimes.map((showtime: any) => (
                            <span className='border rounded-full py-1 px-2'>
                              {showtime.Time}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  }
              </div>
            </div>
          ))}
        </div>
      </main>

      <section className='border p-8'>
        <button className='border' onClick={() => encontrarMejorProgramacion(selectedMovies)}>mostrar ordenadas</button>

        {
          orderedMovies && orderedMovies.length > 0 && orderedMovies.map((movie: any) => (
            <div onClick={() => setCurrentFinishTime(movie.FinishTime)} className={`border rounded p-4 flex gap-2 ${isWatchingTimeAvailable(movie.Time) ? 'bg-green-700 text-black' : ''}`} key={movie.Movie}>
              {movie.Time} - {movie.FinishTime} - {movie.Movie}
            </div>
          ))
        }

        <button onClick={() => sumarMinutos('14:50', '150 minutos')}>
          Sumar minutos
        </button>
      </section>
    </div>
  )
}
