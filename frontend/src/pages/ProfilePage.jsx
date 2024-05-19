import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import NavBar from '../components/navbar';

const ProfilePage = () => {
  const { name } = useParams(); // Use o hook useParams para obter o nome do utilizador da URL
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false); // Estado para verificar se é o próprio perfil
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setError('No token found. Please log in.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5555/api/users/name/${name}`, {
          method: 'GET',
          headers: {
            'x-access-token': token,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        console.log('Profile data fetched:', data);
        setProfile(data);
        setProfilePhoto(data.profilePhoto);

        const userProfileResponse = await fetch('http://localhost:5555/api/users/profile/me', {
          method: 'GET',
          headers: {
            'x-access-token': token,
            'Content-Type': 'application/json'
          }
        });

        if (!userProfileResponse.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const userProfileData = await userProfileResponse.json();
        setIsOwnProfile(userProfileData._id === data._id); // Verifica se é o próprio perfil
        if (userProfileData._id !== data._id) {
          checkFollowingStatus(data._id);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchProfile();
  }, [name]);

  const checkFollowingStatus = async (userId) => {
    const token = localStorage.getItem('userToken');
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
        setIsFollowing(data.following.includes(userId));
      }
    } catch (error) {
      console.error('Error checking following status:', error);
    }
  };

  const handleFollow = async () => {
    const token = localStorage.getItem('userToken');
    try {
      const response = await fetch(`http://localhost:5555/api/follow/${profile._id}`, {
        method: 'POST',
        headers: {
          'x-access-token': token,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setIsFollowing(true);
      } else {
        throw new Error('Failed to follow user');
      }
    } catch (error) {
      setError(error.message);
      console.error('Error following user:', error); // Log the error for more details
    }
  };

  const handleUnfollow = async () => {
    const token = localStorage.getItem('userToken');
    try {
      const response = await fetch(`http://localhost:5555/api/unfollow/${profile._id}`, {
        method: 'POST',
        headers: {
          'x-access-token': token,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setIsFollowing(false);
      } else {
        throw new Error('Failed to unfollow user');
      }
    } catch (error) {
      setError(error.message);
      console.error('Error unfollowing user:', error); // Log the error for more details
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      handlePhotoUpload(file);
    }
  };

  const handlePhotoUpload = async (file) => {
    const token = localStorage.getItem('userToken');
    if (!token || !file) {
      setError('No token or photo found. Please log in and select a photo.');
      return;
    }

    const formData = new FormData();
    formData.append('profilePhoto', file);

    try {
      const response = await fetch('http://localhost:5555/api/users/profile-photo', {
        method: 'PUT',
        headers: {
          'x-access-token': token,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload profile photo');
      }

      const data = await response.json();
      console.log('Photo upload response:', data);
      setProfile(data);
      setProfilePhoto(data.profilePhoto);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleProfilePhotoClick = () => {
    fileInputRef.current.click();
  };

  if (error) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center text-red-500">{error}</div>;
  }

  if (!profile) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-16">
        <div className="relative w-full h-48 bg-cover bg-center">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <img
              src={profilePhoto || "https://storage.googleapis.com/pditrabalho.appspot.com/1716126416320.jpg"}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white cursor-pointer"
              onClick={handleProfilePhotoClick}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
            />
          </div>
        </div>
        <div className="mt-16 text-center">
          <h1 className="text-3xl font-semibold">{profile.name}</h1>
          {!isOwnProfile && (
            isFollowing ? (
              <button onClick={handleUnfollow} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Unfollow</button>
            ) : (
              <button onClick={handleFollow} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Follow</button>
            )
          )}
          <nav className="mt-4 flex justify-center space-x-4">
            <Link to={`/perfil/${name}/overview`} className="px-4 py-2 text-gray-700 hover:text-blue-500">Visão Geral</Link>
            <Link to={`/perfil/${name}/following`} className="px-4 py-2 text-gray-700 hover:text-blue-500">A seguir</Link>
            <Link to={`/perfil/${name}/followers`} className="px-4 py-2 text-gray-700 hover:text-blue-500">Seguidores</Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
