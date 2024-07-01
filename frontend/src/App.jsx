import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TeatroArte from './pages/teatroarte';
import MusicaFestival from './pages/musicafestival';
import Familia from './pages/familia';
import DesportoAventura from './pages/desportoaventura';
import Login from './pages/login';
import SignUp from './pages/signup';
import EventDetails from './components/eventDetails';
import Cart from './pages/cart';
import ViewTicket from './pages/ViewTicket';
import Tickets from './pages/Tickets';
import Search from './pages/Search';
import ProfilePage from './pages/ProfilePage';
import FollowingPage from './components/FollowingPage';
import FollowersPage from './components/FollowersPage';
import PaymentForm from './components/PaymentForm';
import SettingsPage from './pages/Settings';


const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/teatroarte' element={<TeatroArte />} />
      <Route path='/musicafestivais' element={<MusicaFestival />} />
      <Route path='/familia' element={<Familia />} />
      <Route path='/desportoaventura' element={<DesportoAventura />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/events/:id" element={<EventDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/ticket/:id" element={<ViewTicket />} />
      <Route path="/tickets" element={<Tickets />} /> 
      <Route path="/search" element={<Search />} />
      <Route path="/perfil" element={<ProfilePage />} />
      <Route path="/perfil/:name" element={<ProfilePage />} />
      <Route path="/perfil/:name/following" element={<FollowingPage />} />
      <Route path="/perfil/:name/followers" element={<FollowersPage />} />
      <Route path="/payment" element={<PaymentForm amount={5000} />} /> {/* Example payment route */}
      <Route path="/settings" element={<SettingsPage />} /> {/* Add the settings route */}
    </Routes>
  );
}

export default App;
