import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useUserContext } from '../contexts/UserContext'; 


function UserProfile() {
  const [user, setUser] = useState(null);
  const [userZipCode, setUserZipCode] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [favoritedParks, setFavoritedParks] = useState([]);
  const [userLocations, setUserLocations] = useState([]); 
  const [selectedPark, setSelectedPark] = useState(null);
  const { userId } = useParams();
  const [newLocationName, setNewLocationName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newZipCode, setNewZipCode] = useState('');
  const [showAddLocationForm, setShowAddLocationForm] = useState(false);
  const { setDistanceMatrixData } = useUserContext();


  useEffect(() => {
    const fetchUserDetailsAndLocations = async () => {
      try {
        const userDetailsResponse = await axios.get(`http://localhost:5555/api/users/${userId}`);
        console.log('User details response:', userDetailsResponse.data);
        setUser(userDetailsResponse.data);

        const prefResponse = await axios.get(`http://localhost:5555/api/users/${userId}/preferences/zipcode`);
        console.log('User zip code preference response:', prefResponse.data);
        setUserZipCode(prefResponse.data.preferred_zip_code || '');

        const parksResponse = await axios.get(`http://localhost:5555/api/users/${userId}/favorited-parks`);
        console.log('Favorited parks response:', parksResponse.data);
        setFavoritedParks(parksResponse.data);

        const locationsResponse = await axios.get(`http://localhost:5555/api/users/${userId}/locations`);
        console.log('User locations response:', locationsResponse.data);
        setUserLocations(locationsResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserDetailsAndLocations();
  }, [userId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      await axios.post(`http://localhost:5555/api/users/${userId}/preferences`, {
        preference_key: 'preferred_zip_code',
        preference_value: userZipCode,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating zip code preference:', error);
    }
  };

  const handleZipCodeChange = (e) => {
    setUserZipCode(e.target.value);
  };

  const toggleParkDetails = (parkId) => {
    setSelectedPark(selectedPark === parkId ? null : parkId);
  };

  const removeParkFromFavorites = async (parkId) => {
    try {
      await axios.delete(`http://localhost:5555/api/users/${userId}/favorited-parks/${parkId}`);
      // Update local state to reflect the change
      setFavoritedParks(favoritedParks.filter(park => park.id !== parkId));
    } catch (error) {
      console.error('Error removing park from favorites:', error);
    }
  };


  const addLocation = async () => {
    try {
      const response = await axios.post(`http://localhost:5555/api/users/${userId}/locations`, {
        location_name: newLocationName,
        address: newAddress,
        zip_code: newZipCode
      });
      setUserLocations([...userLocations, response.data]); 
      setNewLocationName('');
      setNewAddress('');
      setNewZipCode('');
    } catch (error) {
      console.error('Error adding new location:', error);
    }
  };

  const toggleAddLocationForm = () => {
    setShowAddLocationForm(!showAddLocationForm);
  };

  const removeLocation = async (locationId) => {
    try {
      await axios.delete(`http://localhost:5555/api/users/${userId}/locations/${locationId}`);
      setUserLocations(userLocations.filter(location => location.id !== locationId));
    } catch (error) {
      console.error('Error removing location:', error);
    }
  };
  const getDistanceMatrix = async () => {
    const origins = userLocations.map(location => `${location.address}, ${location.zip_code}`);
    const destinations = favoritedParks.map(park => park.location);

    try {
      const response = await axios.post('http://localhost:5555/api/distance-matrix', {
        origins,
        destinations,
      });
      setDistanceMatrixData(response.data);
      setDistanceMatrixData(fetchedData);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching distance matrix:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="user-profile-container">
        <h2>User Profile</h2>
        <p><strong>Name:</strong> {user?.username}</p>
        <p><strong>Email:</strong> {user?.email}</p>
  
        {isEditing ? (
          <div>
            <input
              type="text"
              value={userZipCode}
              onChange={handleZipCodeChange}
              placeholder="Enter new zip code"
            />
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        ) : (
          <div>
            <p><strong>Zip Code:</strong> {userZipCode || 'Not set'}</p>
            <button onClick={handleEdit}>Edit Zip Code</button>
          </div>
        )}
        <h3>Favorited Parks</h3>
                {favoritedParks.length > 0 ? (
                  favoritedParks.map((park) => (
                    <div key={park.id}>
                      <span onClick={() => toggleParkDetails(park.id)} style={{cursor: 'pointer', textDecoration: 'underline'}}>
                        {park.name}
                      </span>
                      {selectedPark === park.id && (
                        <div>
                          <p>{park.location}</p>
                          <button onClick={() => removeParkFromFavorites(park.id)}>Remove</button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No favorited parks found.</p>
                )}
        <h3>User Locations</h3>
            {userLocations.length > 0 ? (
              userLocations.map((location) => (
                <div key={location.id}>
                  <p><strong>{location.location_name}:</strong> {location.address} ({location.zip_code})</p>
                  <button onClick={() => removeLocation(location.id)}>Remove</button>
                </div>
              ))
            ) : (
              <p>No locations set.</p>
            )}

        <button onClick={toggleAddLocationForm}>
          {showAddLocationForm ? 'Cancel Adding Location' : 'Add New Location'}
        </button>

        {showAddLocationForm && (
          <div>
            <h4>New Location Details</h4>
            <input
              type="text"
              placeholder="Location Name"
              value={newLocationName}
              onChange={(e) => setNewLocationName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Address"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
            />
            <input
              type="text"
              placeholder="Zip Code"
              value={newZipCode}
              onChange={(e) => setNewZipCode(e.target.value)}
            />
            <button onClick={addLocation}>Submit Location</button>
          </div>
           
        )}
      </div>
      <button onClick={getDistanceMatrix}>Get Distance Matrix</button>
    </>
    );
}

export default UserProfile;
