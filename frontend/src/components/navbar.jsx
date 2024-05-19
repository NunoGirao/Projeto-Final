import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import logo from "../assets/logo.png";


const NavBar = ({ cartCount }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profile, setProfile] = useState(null); // Store the full profile data
  const [profilePhoto, setProfilePhoto] = useState(); // Default profile photo

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('userToken'); // Use userToken
    setIsLoggedIn(!!token);

    if (token) {
      fetchUserProfile(token);
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
        setProfile(data); // Store the full profile data
        setProfilePhoto(data.profilePhoto ); // Set the profile photo or default image
      } else {
        console.error('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken'); // Use userToken
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleProfileClick = () => {
    if (profile && profile.name) {
      navigate(`/perfil/${profile.name}`);
    }
    setShowDropdown(!showDropdown);
  };

  const getBarColor = (path) => {
    switch (path) {
      case "/teatroarte":
        return "bg-red-400";
      case "/musicafestival":
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
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <nav className="bg-white">
        <div className="flex justify-between items-center px-4 py-2">
          <div className="flex items-center ml-20">
            <Link to="/">
              <img src={logo} alt="Logo" style={{ width: "80px", height: "40px" }} />
            </Link>
            <div className="flex nav-links ml-4">
              <Link to="/teatroarte" className="pt-2 px-2 bg-red-400 mr-2 flex flex-col items-center text-white text-xs py-1">
                <span>TEATRO & ARTE</span>
              </Link>
              <Link to="/musicafestival" className="px-2 bg-blue-700 mr-2 flex flex-col items-center text-white text-xs py-1">
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
          <form className="max-w-md mx-auto" onSubmit={handleSearchSubmit}>
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
                    <Link to={`/perfil/${profile.name}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">View Profile</Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
                    <Link to="/tickets" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">View Tickets</Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <Link to="/login" className="mr-2 text-sm">
                  Log In
                </Link>
                <Link to="/signup" className="text-sm">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <div className={`${barColor}`} style={{ height: "5px", width: "100%", marginTop: "0px" }}></div>
    </div>
  );
};

export default NavBar;
