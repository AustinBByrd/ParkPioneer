import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';

const mapContainerStyle = {
  height: "500px",
  width: "800px",
};


const libraries = ["places"];

function MyMapComponent() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [address, setAddress] = useState("");
  const mapRef = useRef();
  const [markers, setMarkers] = useState([]);
  const [selectedPark, setSelectedPark] = useState(null);
  const [center, setCenter] = useState({ lat: 38.7875, lng: -90.6299 }); 

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;
  
    const service = new window.google.maps.places.PlacesService(mapRef.current);
  
    const request = {
      location: center,
      radius: '10000',
      type: ['park'],
    };
  
    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        const newMarkers = results.map((result) => ({
          lat: result.geometry.location.lat(),
          lng: result.geometry.location.lng(),
          name: result.name, 
          address: result.vicinity,
          rating: result.rating,
          placeId: result.place_id,
        }));
  
        setMarkers(newMarkers);

      }
    });
  }, [isLoaded, center]);
  

  const geocodeAddress = () => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === 'OK') {
        setCenter({
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        });
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  };

  const handleMarkerClick = useCallback((park) => {
    setSelectedPark(park);
  }, []);

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  const addParkToFavorites = async (park) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
   
      alert('Please log in to add parks to your favorites.');
      return; 
    }
    
    try {
      const response = await axios.post('http://localhost:5555/api/add-favorite', {
        userId,
        parkName: park.name,
        parkLocation: park.address,
       
      });
      console.log('Park added to favorites:', response.data);
     
      alert('Park added to favorites successfully!');
    } catch (error) {
      console.error('Failed to add park to favorites:', error);

      alert('Failed to add park to favorites. Please try again.');
    }
  };
  
  

    return (
    <>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter a location"
      />
      <button onClick={geocodeAddress}>Find Location</button>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
        onLoad={onMapLoad}
      >
        {markers.map((marker, index) => (
          <Marker 
            key={index} 
            position={{ lat: marker.lat, lng: marker.lng }} 
            onClick={() => handleMarkerClick(marker)} 
            visible={true} 
          />
        ))}
        {selectedPark && (
          <InfoWindow
            position={{ lat: selectedPark.lat, lng: selectedPark.lng }}
            onCloseClick={() => setSelectedPark(null)}
          >
            <div style={{ color: 'black' }}>
              <h2>{selectedPark.name}</h2>
              <p>Rating: {selectedPark.rating ? selectedPark.rating : "N/A"}</p>
              <p>Address: {selectedPark.address}</p>
              <button onClick={(e) => {
                e.stopPropagation(); 
                addParkToFavorites(selectedPark);
              }}>Add to Favorites</button>
              
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPark.lat},${selectedPark.lng}`}
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ display: 'block', marginTop: '10px' }}
              >
                Get Directions
              </a>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </>
  );
}

export default MyMapComponent;