import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

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

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

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
          <Marker key={index} position={{ lat: marker.lat, lng: marker.lng }} visible={true} />
        ))}
      </GoogleMap>
    </>
  );
}

export default MyMapComponent;
