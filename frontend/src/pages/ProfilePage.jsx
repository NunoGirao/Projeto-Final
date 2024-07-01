import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/navbar";
import {
  FaUserPlus,
  FaUserMinus,
  FaTicketAlt,
  FaPaintBrush,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Card = ({ children, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="w-32 h-32 md:w-48 md:h-64 border rounded-lg shadow-md overflow-hidden cursor-pointer bg-white transition-shadow hover:shadow-lg"
    onClick={onClick}
  >
    {children}
  </motion.div>
);

const TicketCard = ({ ticket }) => (
  <Card>
    <img
      src={ticket.eventImage}
      alt="Bilhete"
      className="w-full h-full object-cover"
    />
    <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-gray-800 bg-opacity-75 text-white">
      <p className="text-xs md:text-sm truncate">{ticket.eventName}</p>
    </div>
  </Card>
);

const NftImageCard = ({ nftImage }) => (
  <Card>
    {nftImage ? (
      <img
        src={nftImage}
        alt="NFT"
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/150?text=NFT";
        }}
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        <FaPaintBrush size={24} />
      </div>
    )}
  </Card>
);

const SelectionModal = ({ items, onSelect, onClose, searchPlaceholder }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = items.filter((item) => {
    if (item.eventName) {
      return item.eventName.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return item.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Selecione um Item</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <div className="relative mb-4">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border rounded-lg"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredItems.map((item, index) => (
            <Card key={index} onClick={() => onSelect(item)}>
              <img
                src={item.eventImage || item}
                alt="Item"
                className="w-full h-full object-cover"
              />
            </Card>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

const ProfilePage = () => {
  const { name } = useParams();
  const [profile, setProfile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [redeemedTickets, setRedeemedTickets] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState([null, null, null]);
  const [selectedNftImages, setSelectedNftImages] = useState([null, null, null]);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showNftModal, setShowNftModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  const fetchProfile = useCallback(async () => {
    console.log("Fetching profile for:", name);
    const token = localStorage.getItem("userToken");
    if (!token) {
      console.error("No token found");
      setError("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5555/api/users/name/${name}`,
        {
          method: "GET",
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Profile data:", data);
      setProfile(data);

      const userProfileResponse = await fetch(
        "http://localhost:5555/api/users/profile/me",
        {
          method: "GET",
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          }
        }
      );

      if (!userProfileResponse.ok) {
        throw new Error(`Failed to fetch user profile: ${userProfileResponse.statusText}`);
      }

      const userProfileData = await userProfileResponse.json();
      console.log("Current user data:", userProfileData);
      setCurrentUser(userProfileData);
      setIsOwnProfile(userProfileData._id === data._id);
      
      if (userProfileData._id !== data._id) {
        checkFollowingStatus(data._id);
      }

      // Fetch tickets for the profile being viewed
      const ticketsResponse = await fetch(`http://localhost:5555/api/tickets/user/${data._id}`, {
        headers: {
          "x-access-token": token,
        }
      });

      if (!ticketsResponse.ok) {
        throw new Error(`Failed to fetch tickets: ${ticketsResponse.statusText}`);
      }

      const ticketsData = await ticketsResponse.json();
      console.log("Tickets data:", ticketsData);
      const activeTickets = ticketsData.filter((ticket) => !ticket.redeemed);
      const redeemedTickets = ticketsData.filter((ticket) => ticket.redeemed);
      setTickets(activeTickets);
      setRedeemedTickets(redeemedTickets);

      if (isOwnProfile) {
        const savedSelectedTickets = JSON.parse(localStorage.getItem("selectedTickets")) || [null, null, null];
        const savedSelectedNftImages = JSON.parse(localStorage.getItem("selectedNftImages")) || [null, null, null];
        setSelectedTickets(savedSelectedTickets);
        setSelectedNftImages(savedSelectedNftImages);
      } else {
        // For other users' profiles, show their first 3 tickets and NFTs
        setSelectedTickets(activeTickets.slice(0, 3));
        setSelectedNftImages((data.nftImages || []).slice(0, 3));
      }
    } catch (error) {
      console.error("Error in fetchProfile:", error);
      setError(error.message);
    }
  }, [name, isOwnProfile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const checkFollowingStatus = async (userId) => {
    const token = localStorage.getItem("userToken");
    try {
      const response = await fetch(
        "http://localhost:5555/api/users/profile/me",
        {
          method: "GET",
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.following.includes(userId));
      }
    } catch (error) {
      console.error("Error checking following status:", error);
    }
  };

  const handleFollow = async () => {
    const token = localStorage.getItem("userToken");
    try {
      const response = await fetch(
        `http://localhost:5555/api/follow/${profile._id}`,
        {
          method: "POST",
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          }
        }
      );

      if (response.ok) {
        setIsFollowing(true);
      } else {
        throw new Error("Failed to follow user");
      }
    } catch (error) {
      setError(error.message);
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async () => {
    const token = localStorage.getItem("userToken");
    try {
      const response = await fetch(
        `http://localhost:5555/api/unfollow/${profile._id}`,
        {
          method: "POST",
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          }
        }
      );

      if (response.ok) {
        setIsFollowing(false);
      } else {
        throw new Error("Failed to unfollow user");
      }
    } catch (error) {
      setError(error.message);
      console.error("Error unfollowing user:", error);
    }
  };

  const handleTicketBoxClick = (index) => {
    if (isOwnProfile) {
      setCurrentIndex(index);
      setShowTicketModal(true);
    }
  };

  const handleNftBoxClick = (index) => {
    if (isOwnProfile) {
      setCurrentIndex(index);
      setShowNftModal(true);
    }
  };

  const handleTicketSelect = (ticket) => {
    if (isOwnProfile) {
      const newSelectedTickets = [...selectedTickets];
      newSelectedTickets[currentIndex] = ticket;
      setSelectedTickets(newSelectedTickets);
      setShowTicketModal(false);
      localStorage.setItem("selectedTickets", JSON.stringify(newSelectedTickets));
    }
  };

  const handleNftSelect = (nftImage) => {
    if (isOwnProfile) {
      const newSelectedNftImages = [...selectedNftImages];
      newSelectedNftImages[currentIndex] = nftImage;
      setSelectedNftImages(newSelectedNftImages);
      setShowNftModal(false);
      localStorage.setItem("selectedNftImages", JSON.stringify(newSelectedNftImages));
    }
  };

  const getFilteredItems = (items, selectedItems) => {
    return items.filter((item) => !selectedItems.includes(item));
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const uniqueNftImages = [...new Set(profile?.nftImages || [])].filter(Boolean);

  return (
    <div className="bg-gray-100 min-h-screen relative">
      <NavBar className="z-50" />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="sm:flex sm:space-x-5">
                <div className="flex-shrink-0">
                  <img
                    src={profile.profilePhoto}
                    alt={profile.name}
                    className="mx-auto h-20 w-20 rounded-full border-4 border-white -mt-16 sm:-mt-24"
                  />
                </div>
                <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                  <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                    {profile.name}
                  </h1>
                  <p className="text-sm font-medium text-gray-600">
                    @{profile.username}
                  </p>
                </div>
              </div>
              {!isOwnProfile && (
                <div className="mt-5 flex justify-center sm:mt-0">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={isFollowing ? handleUnfollow : handleFollow}
                    className={`flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                      isFollowing
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isFollowing ? (
                      <FaUserMinus className="mr-2" />
                    ) : (
                      <FaUserPlus className="mr-2" />
                    )}
                    {isFollowing ? "Unfollow" : "Follow"}
                  </motion.button>
                </div>
              )}
            </div>
          </div>
          <nav className="flex justify-center border-t border-gray-200 bg-gray-50">
            <a
              href={`/perfil/${profile.name}`}
              className="px-3 py-4 text-sm font-medium text-gray-900 hover:text-blue-600"
            >
              Visão Geral
            </a>
            <a
              href={`/perfil/${profile.name}/following`}
              className="px-3 py-4 text-sm font-medium text-gray-500 hover:text-blue-600"
            >
              A seguir
            </a>
            <a
              href={`/perfil/${profile.name}/followers`}
              className="px-3 py-4 text-sm font-medium text-gray-500 hover:text-blue-600"
            >
              Seguidores
            </a>
          </nav>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
            <FaTicketAlt className="mr-2" /> {isOwnProfile ? "Meus Bilhetes" : `Bilhetes de ${profile.name}`}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {selectedTickets.map((ticket, index) => (
              <div key={index} onClick={() => isOwnProfile && handleTicketBoxClick(index)}>
                {ticket ? (
                  <TicketCard ticket={ticket} />
                ) : (
                  isOwnProfile && (
                    <Card>
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FaTicketAlt size={24} />
                      </div>
                    </Card>
                  )
                )}
              </div>
            ))}
          </div>
        </div>

        {uniqueNftImages.length > 0 && (
          <div className="mt-12 relative z-10">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
              <FaPaintBrush className="mr-2" /> {isOwnProfile ? "Minhas Imagens NFT" : `Imagens NFT de ${profile.name}`}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {selectedNftImages.map((nftImage, index) => (
                <div key={index} onClick={() => isOwnProfile && handleNftBoxClick(index)}>
                  {nftImage ? (
                    <NftImageCard nftImage={nftImage} />
                  ) : (
                    isOwnProfile && (
                      <Card>
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <FaPaintBrush size={24} />
                        </div>
                      </Card>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {showTicketModal && (
            <SelectionModal
              items={getFilteredItems(tickets, selectedTickets)}
              onSelect={handleTicketSelect}
              onClose={() => setShowTicketModal(false)}
              searchPlaceholder="Search for tickets..."
            />
          )}
          {showNftModal && (
            <SelectionModal
              items={getFilteredItems(uniqueNftImages, selectedNftImages)}
              onSelect={handleNftSelect}
              onClose={() => setShowNftModal(false)}
              searchPlaceholder="Search for NFTs..."
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfilePage;
