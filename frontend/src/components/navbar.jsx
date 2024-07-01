import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaBars } from "react-icons/fa";
import logo from "../assets/logo.png";

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profile, setProfile] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState();
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const formRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    setIsLoggedIn(!!token);

    if (token) {
      fetchUserProfile(token);
      updateCartCount(token);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch('http://localhost:5555/api/users/profile/me', {
        method: 'GET',
        headers: {
          'x-access-token': token,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setProfilePhoto(data.profilePhoto);
      } else {
        console.error('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const updateCartCount = async (token) => {
    try {
      const response = await fetch('http://localhost:5555/api/cart', {
        headers: {
          'x-access-token': token,
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCartCount(data.items.length);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const getBarColor = (path) => {
    switch (path) {
      case "/teatroarte":
        return "bg-red-400";
      case "/musicafestivais":
        return "bg-blue-700";
      case "/familia":
        return "bg-yellow-700";
      case "/desportoaventura":
        return "bg-red-700";
      default:
        return "bg-black";
    }
  };

  const barColor = getBarColor(location.pathname);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`/search?query=${searchQuery}`);
      closeMenu();
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 769) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <nav className="bg-white">
        <div className="flex justify-between items-center px-4 py-2">
          <div className="flex items-center">
            <Link to="/">
              <img src={logo} alt="Logo" style={{ width: "80px", height: "40px" }} />
            </Link>
            <button onClick={toggleMenu} className="ml-4 lg:hidden">
              <FaBars className="text-2xl" />
            </button>
            <div className="hidden lg:flex nav-links ml-4">
              <Link to="/teatroarte" className="pt-2 px-2 bg-red-400 mr-2 flex flex-col items-center text-white text-xs py-1">
                <span>TEATRO & ARTE</span>
              </Link>
              <Link to="/musicafestivais" className="px-2 bg-blue-700 mr-2 flex flex-col items-center text-white text-xs py-1">
                <span>MÚSICA & </span>
                <span>FESTIVAIS</span>
              </Link>
              <Link to="/familia" className="pt-2 px-2 bg-yellow-700 mr-2 flex flex-col items-center text-white text-xs py-1">
                <span>FAMILIA</span>
              </Link>
              <Link to="/desportoaventura" className="px-2 bg-red-700 flex flex-col items-center text-white text-xs py-1">
                <span>DESPORTO &</span>
                <span>AVENTURA</span>
              </Link>
            </div>
          </div>
          <form ref={formRef} className="max-w-md mx-auto hidden lg:block" onSubmit={handleSearchSubmit}>
            <div className="flex">
              <div className="relative w-full">
                <input
                  type="search"
                  id="search-dropdown"
                  className="block p-2 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-l-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Pesquisar..."
                  required
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute top-0 right-0 p-2 text-sm font-medium h-full text-black rounded-r-lg"
                >
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                  <span className="sr-only">Search</span>
                </button>
              </div>
            </div>
          </form>
          <div className="flex items-center relative">
            {isLoggedIn ? (
              <>
                <Link to="/cart" className="relative">
                  <FaShoppingCart className="text-2xl" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <img
                  src={profilePhoto}
                  alt="User"
                  onClick={handleProfileClick}
                  className="w-8 h-8 ml-4 rounded-full cursor-pointer"
                />
                {showDropdown && (
                  <div className="absolute right-0 mt-60 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                    <Link to={`/perfil/${profile.name}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowDropdown(false)}>Perfil</Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowDropdown(false)}>Defenições</Link>
                    <Link to="/tickets" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowDropdown(false)}>Bilhetes</Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sair
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <Link to="/login" className="mr-2 text-sm hidden lg:block" onClick={closeMenu}>
                  Entrar
                </Link>
                <Link to="/signup" className="text-sm hidden lg:block" onClick={closeMenu}>Registar
                </Link>
              </>
            )}
          </div>
        </div>
        {menuOpen && (
          <div className="w-full lg:hidden">
            <form className="px-4 pb-2" onSubmit={handleSearchSubmit}>
              <div className="flex">
                <div className="relative w-full">
                  <input
                    type="search"
                    id="search-dropdown"
                    className="block p-2 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-l-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Pesquisar..."
                    required
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="absolute top-0 right-0 p-2 text-sm font-medium h-full text-black rounded-r-lg"
                  >
                    <svg
                      className="w-4 h-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                    <span className="sr-only">Search</span>
                  </button>
                </div>
              </div>
            </form>
            <div className="flex flex-col items-center">
              <Link
                to="/teatroarte"
                className="w-full py-2 bg-red-400 flex justify-center text-white text-xs"
                onClick={closeMenu}
              >
                TEATRO & ARTE
              </Link>
              <Link
                to="/musicafestivais"
                className="w-full py-2 bg-blue-700 flex justify-center text-white text-xs"
                onClick={closeMenu}
              >
                MÚSICA & FESTIVAIS
              </Link>
              <Link
                to="/familia"
                className="w-full py-2 bg-yellow-700 flex justify-center text-white text-xs"
                onClick={closeMenu}
              >
                FAMILIA
              </Link>
              <Link
                to="/desportoaventura"
                className="w-full py-2 bg-red-700 flex justify-center text-white text-xs"
                onClick={closeMenu}
              >
                DESPORTO & AVENTURA
              </Link>
            </div>
          </div>
        )}
      </nav>
      <div className={`${barColor}`} style={{ height: "5px", width: "100%", marginTop: "0px" }}></div>
    </div>
  );
};

export default NavBar;
