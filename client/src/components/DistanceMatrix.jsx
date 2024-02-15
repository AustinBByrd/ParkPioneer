import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';
import { useUserContext } from '../contexts/UserContext';
import axios from 'axios';

const mapContainerStyle = {
  height: "400px",
  width: "600px",
};

const libraries = ["places"];

function DistanceMatrixComponent({ favoritedParks }) {
    const { distanceMatrixData, originNames } = useUserContext();
    const [destinationMarkers, setDestinationMarkers] = useState([]);
    const [selectedDestination, setSelectedDestination] = useState(null);
    // console.log('favoritedParks:', favoritedParks);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const metersToMiles = (meters) => (meters / 1609.344).toFixed(2);
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
        const validDestinations = distanceMatrixData.destination_addresses.filter(address => address.trim() !== "");
        const geocodeAllDestinations = async () => {
            const geocodedDestinations = await Promise.all(
                validDestinations.map(address => geocodeAddress(address))
            );
            setDestinationMarkers(geocodedDestinations.map((loc, index) => {
                const currentAddress = validDestinations[index].toLowerCase();
                // console.log(`Geocoded Address: ${currentAddress}`);
                const parkMatch = favoritedParks.find(park => {
                    const parkAddressNormalized = park.location.toLowerCase();
                    return currentAddress.includes(parkAddressNormalized) || parkAddressNormalized.includes(currentAddress);
                });
        
                const parkName = parkMatch ? parkMatch.name : `Park ${index + 1}`;
                // console.log(`Matched Park Name: ${parkName}`);
                return {
                    lat: loc.lat,
                    lng: loc.lng,
                    name: parkName,
                    index: index,
                };
            }));
        };
        
        geocodeAllDestinations();
    }, [isLoaded, distanceMatrixData, favoritedParks]);

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
                    position={{ lat: destinationMarkers[selectedDestination].lat, lng: destinationMarkers[selectedDestination].lng }}
                    onCloseClick={() => setSelectedDestination(null)}
                >
                    <div>
                        <h2>{destinationMarkers[selectedDestination].name}</h2>
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