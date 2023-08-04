import React, { useEffect, useState } from 'react';
import './movies.css';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

function Movies() {

  const apiUrl = process.env.REACT_APP_API_URL_PROD;
  const imagePath = process.env.REACT_APP_IMG_URL;
  const apiGenre = process.env.REACT_APP_API_KEY_GENRE;
  const apiGenreList = process.env.REACT_APP_GENRES_LIST;

  // Declaramos las Variables de Estado
  //En React, las variables de estado son una forma de almacenar y gestionar datos que pueden cambiar a lo largo del tiempo y afectar la representación visual del componente.
    const [movies, setMovies] = useState([]);     
    const [genres, setGenres] = useState([]);      
    const [moviesRandom, setMoviesRandom] = useState([]);                           
    const [searchKey] = useState("");                     
    const [typeSearch] = useState("discover");                     
    const [loaded, setLoaded] = useState(false);
    
   

    //Las opciones para la petición
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: process.env.REACT_APP_API_TOKEN_ACCESS_PROD
      },
    };
    

    //Función para obtener las peliculas.
      //1. Validamos si (typeSearch) para saber el tipo de búsqueda.
      //2. Si Viene vácio entonces toma el valor de discover el cual se pasará en la URL de la API para obtener todas las peliculas.
      //3. Si Contiene algún valor, se toma ese valor ingresado y le anexamos lo correspondiente a la API agregando un %20 ( Codificación URL o porcentaje-20) en cada espacio para enviarlo.
      //4. Parseamos los valores obtenidos en el response.
      //5. Si el status es 200 que es porque la petición se generó correctamente, almacenamos el arreglo de las peliculas en nuestra variable de estado setMovies().
      //6. De lo contrario, si no hay peliculas registradas se almacenará en setMovies un arreglo vácio.
      //7. Si algo falla, lo atraparemos en el Catch y Mostraremos que algo falló

    async function fetchMovies(searchKey, typeSearch) {
      try {
        
        let response;

        switch (typeSearch) {
          case 'search':
            const movieSearch = searchKey.replace(/ /g, "%20");
            response = await fetch(`${apiUrl}${typeSearch}/movie?query=${movieSearch}`, options);
            break;
          case 'discover': // Para obtener todos
            response = await fetch(`${apiUrl}${typeSearch}/movie`, options);
            break;
          case 'genre': // Para obtener las peliculas por genero
          response = await fetch(`${apiGenre}${searchKey}`, options);
            break;
          default: //Default - Todas las peliculas
            response = await fetch(`${apiGenre}${searchKey}`, options);
            break;
        }

        const movies = await response.json();
        if (response.status === 200 && movies.results.length > 0) { 
          setMovies(movies.results);
          const randomMovies = [];
          let verificador = 0;
          for (let i = 0; i < 4;) { //Generamos 5 Numeros para sacar 5 peliculas random 
            const randomIndex = Math.floor(Math.random() * movies.results.length);
            if(randomIndex !== verificador && movies.results[randomIndex].poster_path !== '' && movies.results[randomIndex].title !== '' ){
             
              randomMovies.push(movies.results[randomIndex]);
              i++
            }
            verificador = randomIndex;
          }
          setMoviesRandom(randomMovies);
          
        } else if(movies.results.length === 0) {
          setMovies([]); 
          Swal.fire({
            title: 'Sin resultados Disponibles',
            icon: 'info',
            confirmButtonText: 'Ok'
          });
        }else{
          setMovies([]); 
          Swal.fire({
            title: 'Servicio no Disponible',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }
      } catch (err) {
        Swal.fire({
          title: err,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    }

    //Función para Obtener los Géneros de las peliculas
    async function fetchGenres(){
      try {
       let response = await fetch(`${apiGenreList}`, options);
        const genres = await response.json();
        if(genres){
          setGenres(genres.genres);
        }
      } catch (err) {
        Swal.fire({
          title: err,
          icon: 'error',
          confirmButtonText: 'Ok'
        })
      }
    }


    useEffect(() => {
      setTimeout(() => {
        setLoaded(true);
      }, 100);
      fetchMovies(searchKey, typeSearch); 
      fetchGenres();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 


    //Función para formatear la fecha tipo [ Día-Mes-Año ]
    const formatDate = (dateStr) => {
        const months = [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ];
      
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
      
        return `${day} ${month} ${year}`;
    };

    
    return (
      <div className={`page ${loaded ? 'fade-in' : ''}`}>
      <div id="carouselExampleCaptions" className="carousel slide carousel-fade" data-mdb-ride="carousel"  data-bs-interval="3000"> 
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="3" aria-label="Slide 4"></button>
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="4" aria-label="Slide 5"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
              <img src="https://i.postimg.cc/hPC0kzSS/Amarillo-Negro-Pochoclos-D-a-del-Padre-Tarjeta.png" className="d-block w-100 imgMoviesDiscover" alt="..."></img>
              <div class="overlay"></div>
              <div className="carousel-caption d-none d-md-block">
              <h6 className='fw-bolder mx-3'>The best of cinema from your home</h6>
              </div>
          </div>

          {moviesRandom.map((random) => (
            <div key={random.id} class="carousel-item">
              <img src={imagePath + random.poster_path} className="d-block w-100 imgMoviesDiscover" alt="..."></img>
              <div class="overlay"></div>
              <div className="carousel-caption d-none d-md-block infoMovie">
                <h6 className='fw-bolder mx-3'>{random.title}</h6>
                <Link  className='btn btn-outline-warning' to={`/movie/${random.id}`}>Learn More</Link>
              </div>
            </div>
          ))}
          
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

        {/* <h1 className='text-center mx-5 my-5 text-warning'>SAMFLIX</h1> */}
        <h1 className='text-center mx-5 my-5 text-warning'>MOVIES</h1>
        {/* Contenedor para mostrar las peliculas actuales */}
        <div className='container mt-3'>

        {/* Buscador */}
        <div className="row g-3 align-items-center mb-3">
          <div className="col-10">
            <input type="text" id="inputSearch" className="form-control" placeholder='Ingresa el Nombre de la Pelicula'></input>
          </div>
          <div className="col-2"> 
            <button type="button" className="btn btn-warning" onClick={() => fetchMovies(document.getElementById('inputSearch').value, 'search')}>Buscar</button>
          </div>
        </div>
       
        <div className="row g-3 align-items-center mb-3">
          <div className="col-11">
            <button  type="button" className='btn mx-2 my-2 fw-bolder btn-warning' onClick={() => fetchMovies('', 'discover')}>Tendency</button>
            {genres.map((genre, index) => (  
              <button key={genre.id}  type="button" className={`btn mx-2 my-2 fw-bolder ${index % 2 === 0 ? 'btn-outline-warning' : 'btn-outline-light'}`} onClick={() => fetchMovies(genre.id, 'genre')}>{genre.name}</button>
            ))}
          </div>
        </div>

        
          <div className='row'>
            {movies.map((movie) => (
              <div
              key={movie.id} className="col-sm-12 col-md-6 col-lg-3 text-center colMov">
                <img src={movie.poster_path ? imagePath + movie.poster_path : "https://im9.cz/sk/iR/importprodukt-orig/380/380c6041136fc518c004740c31a6fec3--mmf350x350.jpg"} alt="" height={600} width="100%" className='mx-auto my-3'></img>
                <div className='titleMovRelase'>
                    <p className='titleMov text-uppercase'>{movie.title}</p>
                    <p className='ageMov text-uppercase'>{formatDate(movie.release_date)}</p>
                  </div>
                  <div className="ratioPercent" style={{ '--ratio': Number((movie.vote_average)).toFixed(2) / 10, '--colorPercent': movie.vote_average >= 7 ? ' #18c018' : movie.vote_average >= 5 ? ' #f7a019' : 'red'  }}><span className='percentSpan'>{Math.floor(Number((movie.vote_average)).toFixed(2) * 10 )}%</span></div>
                <div className="descriptionMov">
                    <p className='text-truncate'> {movie.overview} <br></br><Link  className='learnMore' to={`/movie/${movie.id}`}>Learn More</Link></p>
                    
                </div>
              </div>
              
            ))}
          </div>
        </div>
      </div>
    );
    
}

export default Movies;
