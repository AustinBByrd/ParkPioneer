import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';
import { useUserContext } from '../contexts/UserContext';
import axios from 'axios'; // Assuming axios for API requests

const mapContainerStyle = {
  height: "400px",
  width: "600px",
};

const libraries = ["places"];

function DistanceMatrixComponent() {
    const { distanceMatrixData, originNames } = useUserContext();
    const [destinationMarkers, setDestinationMarkers] = useState([]);
    const [selectedDestination, setSelectedDestination] = useState(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY, 
        libraries,
    });
    
    const metersToMiles = (meters) => (meters / 1609.344).toFixed(2);

    // Function to geocode addresses
    const geocodeAddress = async (address) => {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
            params: {
                address,
                key: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY,
            },
        });
        return response.data.results[0].geometry.location; 
    };

    useEffect(() => {
        if (!isLoaded || !distanceMatrixData) return;

        const geocodeAllDestinations = async () => {
            const geocodedDestinations = await Promise.all(
                distanceMatrixData.destination_addresses.map(address => geocodeAddress(address))
            );

            setDestinationMarkers(geocodedDestinations.map((loc, index) => ({
                lat: loc.lat,
                lng: loc.lng,
                index: index, 
            })));
        };

        geocodeAllDestinations();
    }, [isLoaded, distanceMatrixData]);

    const handleMarkerClick = (index) => {
        setSelectedDestination(index);
    };

    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading Maps";

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={10}
            center={destinationMarkers[0] || { lat: -34.397, lng: 150.644 }} 
        >
            {destinationMarkers.map((marker, index) => (
                <Marker
                    key={index}
                    position={{ lat: marker.lat, lng: marker.lng }}
                    onClick={() => handleMarkerClick(index)}
                />
            ))}

            {selectedDestination !== null && (
                <InfoWindow
                    position={destinationMarkers[selectedDestination]}
                    onCloseClick={() => setSelectedDestination(null)}
                >
                    <div style={{ color: 'black' }}>
                        <h2>Distance and Duration</h2>
                        {distanceMatrixData.rows.map((row, idx) => {
                            const { distance, duration } = row.elements[selectedDestination];
                            return (
                                <p key={idx}>
                                    From {originNames[idx] || `Origin ${idx + 1}`}: {metersToMiles(distance.value)} miles, {duration.text}
                                </p>
                            );
                        })}
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
}

export default DistanceMatrixComponent;
