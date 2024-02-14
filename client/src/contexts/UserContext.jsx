

import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [distanceMatrixData, setDistanceMatrixData] = useState({ destinations: [] });
  const [originNames, setOriginNames] = useState([]);
  


  return (
    <UserContext.Provider value={{ user, setUser, distanceMatrixData, setDistanceMatrixData, originNames, setOriginNames }}>
      {children}
    </UserContext.Provider>
  );
};
