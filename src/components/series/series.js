import React, { useEffect, useState } from 'react';
import './series.css';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function Series() {

  const apiUrl = process.env.REACT_APP_API_URL_PROD;
  const imagePath = process.env.REACT_APP_IMG_URL;
  const apiGenreTv = process.env.REACT_APP_API_KEY_GENRE_TV;
  const apiGenreListTV = process.env.REACT_APP_GENRES_LIST_TV;



  // Declaramos las Variables de Estado
  //En React, las variables de estado son una forma de almacenar y gestionar datos que pueden cambiar a lo largo del tiempo y afectar la representación visual del componente.
  const [series, setSeries] = useState([]);    
  const [genres, setGenres] = useState([]);
  const [seriesRandom, setSeriesRandom] = useState([]);                         
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

    //Función para obtener las series.
      //1. Validamos (type) para saber el tipo de búsqueda.
      //2. Si Viene vácio entonces toma el valor de discover el cual se pasará en la URL de la API para obtener todas las series.
      //3. Si Contiene algún valor, se toma ese valor ingresado y le anexamos lo correspondiente a la API agregando un %20 ( Codificación URL o porcentaje-20) en cada espacio para enviarlo.
      //4. Parseamos los valores obtenidos en el response.
      //5. Si el status es 200 que es porque la petición se generó correctamente, almacenamos el arreglo de las series en nuestra variable de estado setSeries().
      //6. De lo contrario, si no hay series registradas se almacenará en setSeries un arreglo vácio.
      //7. Si algo falla, lo atraparemos en el Catch y Mostraremos que algo falló

    async function fetchseries(searchKey, typeSearch) {
      try {

        let response;
        switch (typeSearch) {
          case 'search':
            const seriesearch = searchKey.replace(/ /g, "%20");
            response = await fetch(`${apiUrl}${typeSearch}/tv?query=${seriesearch}`, options);
            break;
          case 'discover': // Para obtener todos
            response = await fetch(`${apiUrl}${typeSearch}/tv`, options);
            break;
          case 'genre': // Para obtener las peliculas por genero
            response = await fetch(`${apiGenreTv}${searchKey}`, options);
            break;
          default: // Para obtener todos
            response = await fetch(`${apiUrl}${typeSearch}/tv`, options);
            break;
        }
        const series = await response.json();
        if (response.status === 200 && series.results.length > 0) { 
          setSeries(series.results);
          console.log(series.results)
          const randomSeries = [];
          let verificador = 0;
          for (let i = 0; i < 4;) { //Generamos 5 Numeros para sacar 5 peliculas random
            const randomIndex = Math.floor(Math.random() * series.results.length);
            if(randomIndex !== verificador && series.results[randomIndex].poster_path !== '' && series.results[randomIndex].name !== '' ){
              randomSeries.push(series.results[randomIndex]);
              i++
            }
            verificador = randomIndex;
          }
          setSeriesRandom(randomSeries);
        } else if(series.results.length === 0) {
          setSeries([]); 
          Swal.fire({
            title: 'Sin resultados Disponibles',
            icon: 'info',
            confirmButtonText: 'Ok'
          });
        }else{
          setSeries([]); 
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
        })
      }
    }

       //Función para Obtener los Géneros de las series
       async function fetchGenres(){
        try {
         let response = await fetch(`${apiGenreListTV}`, options);
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
        fetchseries(searchKey, typeSearch); 
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

          {seriesRandom.map((random) => (
            <div key={random.id} class="carousel-item">
              <img src={imagePath + random.poster_path} className="d-block w-100 imgMoviesDiscover" alt="..."></img>
              <div class="overlay"></div>
              <div className="carousel-caption d-none d-md-block infoMovie">
                <h6 className='fw-bolder mx-3'>{random.name}</h6>
                <Link  className='btn btn-outline-warning' to={`/serie/${random.id}`}>Learn More</Link>
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

        <h1 className='text-center mx-5 my-5 text-warning'>SERIES</h1>
        {/* Contenedor para mostrar las peliculas actuales */}
        <div className='container mt-3'>

        {/* Buscador */}
        <div class="row g-3 align-items-center mb-3">
          <div class="col-10">
            <input type="text" id="inputSearch" class="form-control" placeholder='Ingresa el Nombre de la Serie'></input>
          </div>
          <div class="col-2">
            <button type="button" class="btn btn-warning" onClick={() => fetchseries(document.getElementById('inputSearch').value, 'search')}>Buscar</button>
          </div>
        </div>

        <div className="row g-3 align-items-center mb-3">
          <div className="col-10">
            <button  type="button" className='btn mx-2 my-2 fw-bolder btn-warning' onClick={() => fetchseries('', 'discover')}>Tendency</button>
            {genres.map((genre, index) => (
              <button key={genre.id}  type="button" className={`btn mx-2 my-2 fw-bolder ${index % 2 === 0 ? 'btn-outline-warning' : 'btn-outline-light'}`} onClick={() => fetchseries(genre.id, 'genre')}>{genre.name}</button>
            ))}
          </div>
        </div>
       
          <div className='row'>
            {series.map((serie) => (
              <div key={serie.id} class="col-sm-12 col-md-6 col-lg-3 text-center colMov">
                <img clas="imgMov" src={serie.poster_path ? imagePath + serie.poster_path : "https://im9.cz/sk/iR/importprodukt-orig/380/380c6041136fc518c004740c31a6fec3--mmf350x350.jpg"} alt="" height={600} width="100%" className='mx-auto my-3'></img>
                <div className='titleMovRelase'>
                  <p className='titleMov text-uppercase'>{serie.name}</p>
                  <p className='ageMov text-uppercase'>{formatDate(serie.first_air_date)}</p>
                </div>
                <div class="ratioPercent" style={{ '--ratio': Number((serie.vote_average)).toFixed(2) / 10, '--colorPercent': serie.vote_average >= 7 ? ' #18c018' : serie.vote_average >= 5 ? ' #f7a019' : 'red'  }}><span className='percentSpan'>{Math.floor(Number((serie.vote_average)).toFixed(2) * 10 )}%</span></div>
                <div className="descriptionMov">
                    <p className='text-truncate'> {serie.overview} <br></br><Link className='learnMore' to={`/serie/${serie.id}`}>Learn More</Link></p>
                    
                </div>
                
              </div>
              
            ))}
          </div>
        </div>
      </div>
    );
    
}

export default Series;
