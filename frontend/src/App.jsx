import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TeatroArte from './pages/teatroarte';
import MusicaFestival from './pages/musicafestival';
import Familia from './pages/familia';
import DesportoAventura from './pages/desportoaventura';
import Login from './pages/login';
import SignUp from './pages/signup';

const App = () => {
  return (
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/teatroarte' element={<TeatroArte />} />
        <Route path='/musicafestival' element={<MusicaFestival />} />
        <Route path='/familia' element={<Familia />} />
        <Route path='/desportoaventura' element={<DesportoAventura />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
  );
}

export default App;
