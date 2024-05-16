import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import slideshow from "../assets/slideshow.webp";

const NavBar = () => {
  const topSpacing = 0;

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const location = useLocation();

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

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <nav className="overflow-hidden bg-white">
        <div className="flex justify-between items-center px-4 py-2">
          <div className="flex items-center ml-20">
            <div>
              <Link to="/">
                <img
                  src={logo}
                  alt="Logo"
                  style={{ width: "80px", height: "40px" }}
                />
              </Link>
            </div>
            <div className="flex nav-links ml-4">
              <Link
                to="/teatroarte"
                className="pt-2 px-2 bg-red-400 mr-2 flex flex-col items-center text-white text-xs py-1"
              >
                <span>TEATRO & ARTE</span>
              </Link>
              <Link
                to="/musicafestival"
                className="px-2 bg-blue-700 mr-2 flex flex-col items-center text-white text-xs py-1"
              >
                <span>MÚSICA & </span>
                <span>FESTIVAIS</span>
              </Link>
              <Link
                to="/familia"
                className="pt-2 px-2 bg-yellow-700 mr-2 flex flex-col items-center text-white text-xs py-1"
              >
                <span>FAMILIA</span>
              </Link>
              <Link
                to="/desportoaventura"
                className="px-2 bg-red-700 flex flex-col items-center text-white text-xs py-1"
              >
                <span>DESPORTO &</span>
                <span>AVENTURA</span>
              </Link>
            </div>
          </div>
          <form className="max-w-md mx-auto">
            <div className="flex">
              <div className="relative w-full">
                <input
                  type="search"
                  id="search-dropdown"
                  className="block p-2 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-l-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                  placeholder="Pesquisar..."
                  required
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
          <div className="flex items-center">
            {isLoggedIn ? (
              <img
                src={slideshow}
                alt="User"
                style={{
                  width: "30px",
                  height: "30px",
                  marginRight: "10px",
                  borderRadius: "50%"
                }}
              />
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
      <div
        className={`${barColor}`}
        style={{ height: "5px", width: "100%", marginTop: `${topSpacing}px` }}
      ></div>
    </div>
  );
};

export default NavBar;
