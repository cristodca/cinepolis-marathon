// Ruta al archivo JSON
const jsonFilePath = './CinepolisTest.json';

export function getJsonInformation() {
  // Devolver una promesa que resuelve con la información JSON
  return fetch(jsonFilePath)
    .then(response => {
      // Verificar si la solicitud fue exitosa
      if (!response.ok) {
        throw new Error(`Error al cargar el archivo JSON (${response.status} ${response.statusText})`);
      }

      // Parsear la respuesta como JSON y devolver la información
      return response.json();
    })
    .catch(error => {
      console.error('Error al obtener el archivo JSON:', error);
      throw error; // Propagar el error para que sea manejado en la función que llama a getJsonInformation
    });
}

export const getMoviesFromCinemaAndDate = async (cinema, date) => {
  try {
    // Obtener la información JSON usando await
    const cinepolis = await getJsonInformation();

    // Hacer algo con la información obtenida
    const cinemaInformation = cinepolis.d.Cinemas.find(c => c.Key === cinema);

    const dateMovies = cinemaInformation.Dates.find(m => m.ShowtimeDate === date);

    return dateMovies.Movies
  } catch (error) {
    // Manejar errores aquí si es necesario
    console.error('Error al obtener información para cinepolis:', error);
  }
};

export const getCinemas = async () => {
  try {
    // Obtener la información JSON usando await
    const cinepolis = await getJsonInformation();

    // Hacer algo con la información obtenida
    const cinemas = Object.entries(cinepolis.d.Locations).map(([key, value]) => ({ Key: key, Name: value }))
    
    return cinemas
  } catch (error) {
    // Manejar errores aquí si es necesario
    console.error('Error al obtener información para cinepolis:', error);
  }
}

export const getDatesFromCinema = async (cinema) => {
  try {
    // Obtener la información JSON usando await
    const cinepolis = await getJsonInformation();

    // Hacer algo con la información obtenida
    const cinemaInformation = cinepolis.d.Cinemas.find(c => c.Key === cinema);
    
    const dates = cinemaInformation.Dates.map((d) => d.ShowtimeDate);

    return dates
  } catch (error) {
    // Manejar errores aquí si es necesario
    console.error('Error al obtener información para cinepolis:', error);
  }
}