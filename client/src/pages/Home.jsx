import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MyMapComponent from '../components/GoogleMap';

function Home() {
    const googleMapsApiKey = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY; 

    return (
        <>
            <Navbar />
            <div>Home Page</div>
            {/* <div style={{ width: '600px', height: '450px', margin: '0 auto' }}>
                <iframe
                    width="600"
                    height="450"
                    style={{ border: '0' }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.google.com/maps/embed/v1/search?q=park%20near%20St.%20Louis%2C%20MO%2C%20USA&key=${googleMapsApiKey}`}
                ></iframe>
            </div> */}
            <MyMapComponent />
        </>
    );
}

export default Home;
