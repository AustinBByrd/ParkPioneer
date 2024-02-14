

import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
 
  const [distanceMatrixData, setDistanceMatrixData] = useState({ destinations: [] });


  return (
    <UserContext.Provider value={{ user, setUser, distanceMatrixData, setDistanceMatrixData }}>
      {children}
    </UserContext.Provider>
  );
};
