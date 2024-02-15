import React from 'react';
import Navbar from '../components/Navbar';
import MyMapComponent from '../components/GoogleMap';


function Home() {
    return (
        <>
            <Navbar />
            <MyMapComponent />
        </>
    );
}

export default Home;