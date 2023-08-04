import React, { useEffect, useState } from 'react';
import './movies.css';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import YouTube from 'react-youtube';

function Movie() {

    const { id } = useParams();
    const [loaded, setLoaded] = useState(false);
    const [triler, setTriler] = useState('');
    const [movies, setMovies] = useState([]);   
    const apiUrl = process.env.REACT_APP_API_URL_SEARCH_MOVIE;
    const imagePath = process.env.REACT_APP_IMG_URL;
    const [isOpen, setIsOpen] = useState(false);

    const handleModalOpen = () => {
      setIsOpen(true);
    };

    const handleModalClose = () => {
      setIsOpen(false);
    };
   
    //Las opciones para la petición
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: process.env.REACT_APP_API_TOKEN_ACCESS_PROD
        },
    };

    //Función para buscar la Pelicula por su ID - Y su Triler
    async function fetchMovie(idMovie) {
        try {
          let response = await fetch(`${apiUrl}${idMovie}`, options);
          const movie = await response.json();
          
          if (response.status === 200) {
            let videoDataMovie = await fetch(`${apiUrl}/${idMovie}/videos`, options);
            const responseVideos = await videoDataMovie.json();
            let videos = [responseVideos.results];
            videos[0].map((video) => (video.name === 'Teaser Trailer' || video.type === 'Trailer') ? setTriler(video.key) : setTriler('')); 
            setMovies([movie]);
          }else{
            setMovies([]); 
            Swal.fire({
                title: 'Sin resultados Disponibles',
                icon: 'info',
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

    useEffect(() => {
        setTimeout(() => {
          setLoaded(true);
        }, 100);
        fetchMovie(id); 
          // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []); 

    //Función para formatear la fecha tipo [ Día-Mes-Año ]
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        return `${year}`;
    };

    const formatHour= (time) =>{
        const hours = Math.floor(time / 60);  //1 Hora         
        const minutes = time % 60;    
        return `${hours}h ${minutes}m`;
    }

    //Opciones para el reproductor del Triler
    const opts = {
      height: '500',
      width: '100%',
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 0,
      },
    };
    
      return (
            <div className={`page ${loaded ? 'fade-in' : ''}`}>

                {movies.map((movie) => (
                    <div className='container-fluid'>
                        <div className='row'>
                            <div className='col-12 custom-height bg-info-movie' style={{ '--bgImgMovie': 'url('+imagePath+ movie.backdrop_path+')' }}>
                            </div>
                            <div className='col-12 movieInfoPrimary d-flex'>
                                <div className='mx-auto bannerMovie'>
                                    <img src={movie.poster_path ? imagePath + movie.poster_path : "https://im9.cz/sk/iR/importprodukt-orig/380/380c6041136fc518c004740c31a6fec3--mmf350x350.jpg"} alt="" height={600} width="100%" className='mx-auto my-3'></img>
                                </div>
                                <div className='mx-auto contenedorPrincipal'>
                                    <h1>{movie.original_title} ({formatDate(movie.release_date)})</h1>
                                    <p>{`${movie.release_date}`.split('-').reverse().join('/')} - {formatHour(movie.runtime)}  </p>
                                    <div className='d-flex my-3'>
                                        <div className="ratioPercentMov" style={{ '--ratio': Number((movie.vote_average)).toFixed(2) / 10, '--colorPercent': movie.vote_average >= 7 ? ' #18c018' : movie.vote_average >= 5 ? ' #f7a019' : 'red'  }}><span className='percentSpan'>{Math.floor(Number((movie.vote_average)).toFixed(2) * 10 )}%</span></div>
                                        <p className='textPunt'>Puntuación del Usuario</p>
                                    </div>
                                    <div className='tagline'>
                                      <i>{movie.tagline}</i>
                                      <button type="button" class="btn btn-outline-warning mx-4" onClick={handleModalOpen} style={{'display': triler === '' ? 'none' : ''}}>View Triler</button>
                                    </div>
                                    <div className='my-4'>
                                      <h2 className='fw-bolder'>Description</h2>
                                      <p>{movie.overview}</p>
                                    </div>
                                    <div className='d-flex genresMovies'>
                                      {movie.genres.map((genres) => (
                                       <p className='fw-bolder'>{genres.name}</p>
                                      ))}
                                    </div>
                                    <div>
                                      {isOpen && (
                                        <div className="modal">
                                          <div className="modal-content">
                                            <span className="close" onClick={handleModalClose}>&times;</span>
                                            <YouTube videoId={triler} opts={opts} />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

      );

      


}

export default Movie;