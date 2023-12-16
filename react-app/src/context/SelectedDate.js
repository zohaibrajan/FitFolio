import React from 'react';
import { useContext, useState } from 'react';


const SelectedDateContext = React.createContext();


export function SelectedDateProvider({ children }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const contextValue = {
    selectedDate,
    setSelectedDate,
  };

  return (
    <SelectedDateContext.Provider value={contextValue}>
      {children}
    </SelectedDateContext.Provider>
  );
}

export const useSelectedDate = () => useContext(SelectedDateContext);
