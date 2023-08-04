import React, { useEffect, useState } from 'react';
import './series.css';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';


function Serie() {

    const { id } = useParams();
    const [loaded, setLoaded] = useState(false);
    const [series, setSeries] = useState([]);   
    const apiUrl = process.env.REACT_APP_API_URL_SEARCH_SERIE;
    const imagePath = process.env.REACT_APP_IMG_URL;

    //Las opciones para la petición
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: process.env.REACT_APP_API_TOKEN_ACCESS_PROD
        },
    };

    //Función para buscar la Pelicula por su ID - Y su Triler
    async function fetchSerie(idSerie) {
        try {
          let response = await fetch(`${apiUrl}${idSerie}`, options);
          const movie = await response.json();
          
          if (response.status === 200) {
            setSeries([movie]);
          }else{
            setSeries([]); 
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
        fetchSerie(id); 
          // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []); 


    //Función para formatear la fecha tipo [ Día-Mes-Año ]
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        return `${year}`;
    };


      return (
            <div className={`page ${loaded ? 'fade-in' : ''}`}>

                {series.map((serie) => (
                    <div className='container-fluid'>
                        <div className='row'>
                            <div className='col-12 custom-height bg-info-movie' style={{ '--bgImgMovie': 'url('+imagePath+ serie.backdrop_path+')' }}>
                            </div>
                            <div className='col-12 movieInfoPrimary d-flex'>
                                <div className='mx-auto bannerMovie'>
                                    <img src={serie.poster_path ? imagePath + serie.poster_path : "https://im9.cz/sk/iR/importprodukt-orig/380/380c6041136fc518c004740c31a6fec3--mmf350x350.jpg"} alt="" height={600} width="100%" className='mx-auto my-3'></img>
                                </div>
                                <div className='mx-auto contenedorPrincipal'>
                                    <h1>{serie.original_name} ({formatDate(serie.first_air_date)})</h1>
                                    <p>{`${serie.first_air_date}`.split('-').reverse().join('/')} - Episodes {`${serie.number_of_episodes}`} | Seasons {`${serie.number_of_seasons}`} </p>
                                    <div className='d-flex my-3'>
                                        <div className="ratioPercentMov" style={{ '--ratio': Number((serie.vote_average)).toFixed(2) / 10, '--colorPercent': serie.vote_average >= 7 ? ' #18c018' : serie.vote_average >= 5 ? ' #f7a019' : 'red'  }}><span className='percentSpan'>{Math.floor(Number((serie.vote_average)).toFixed(2) * 10 )}%</span></div>
                                        <p className='textPunt'>Puntuación del Usuario</p>
                                    </div>
                                    <div className='tagline'>
                                      <i>{serie.tagline}</i>
                                    </div>
                                    <div className='my-4'>
                                      <h2 className='fw-bolder'>Description</h2>
                                      <p>{serie.overview}</p>
                                    </div>
                                    <div className='d-flex genresSeries'>
                                      {serie.genres.map((genres) => (
                                       <p className='fw-bolder'>{genres.name}</p>
                                      ))}
                                    </div>
                                   
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                

            </div>

      );

      


}

export default Serie;