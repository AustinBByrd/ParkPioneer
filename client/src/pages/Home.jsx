import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MyMapComponent from '../components/GoogleMap';
import DistanceMatrixComponent from '../components/DistanceMatrix';

function Home() {
    return (
        <>
            <Navbar />
            <div>Home Page</div>
            <MyMapComponent />
            {/* <DistanceMatrixComponent /> */}
            
        </>
    );
}

export default Home;
