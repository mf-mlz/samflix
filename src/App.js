import React from 'react';

//Importamos los componentes
import Movies from './components/movies/movies';
import Series from './components/series/series';
import Movie from './components/movies/movie';
import Serie from './components/series/serie';
import { Navbar } from './components/navbar/navbar';
import { Route, Routes } from 'react-router-dom';
import { Footer } from './components/footer/footer';

const App = () => {

   const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Movies scrollTop={scrollTop} />}></Route>
        <Route path='/movies' element={<Movies scrollTop={scrollTop} />}></Route>
        <Route path='/series' element={<Series scrollTop={scrollTop} />}></Route>
        <Route path="/movie/:id" element={<Movie scrollTop={scrollTop} />}></Route>
        <Route path="/serie/:id" element={<Serie scrollTop={scrollTop} />}></Route>
      </Routes>
      <Footer />
    </div>
  );
};

export default App;