import React, { useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useUserContext } from '../contexts/UserContext'; 

const mapContainerStyle = {
  height: "400px",
  width: "600px",
};
const libraries = ["places"];


function DistanceMatrixComponent() {
    const { distanceMatrixData } = useUserContext();

    const destinationMarkers = distanceMatrixData.destination_addresses.map((address, index) => (
      <Marker
        key={index}
        position={/* You'll need to convert address to lat/lng */}
        onClick={() => setSelectedDestinationIndex(index)}
      />
    ));
  

    let infoWindowContent = null;
    if (selectedDestinationIndex !== null) {
      const distancesAndDurations = distanceMatrixData.rows.map((row, rowIndex) => {
        const { distance, duration } = row.elements[selectedDestinationIndex];
        return (
          <p key={rowIndex}>
            Origin {rowIndex + 1}: {distance.text}, {duration.text}
          </p>
        );
      });
  
      infoWindowContent = (
        <InfoWindow /* position needs to be set */>
          <div>
            <h2>Destination {selectedDestinationIndex + 1}</h2>
            {distancesAndDurations}
          </div>
        </InfoWindow>
      );
    }
  
    return (
      <GoogleMap /* props */>
        {destinationMarkers}
        {infoWindowContent}
      </GoogleMap>
    );
  }
  