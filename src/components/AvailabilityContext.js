import React, { createContext, useState } from 'react';

// Create the context
export const AvailabilityContext = createContext();

// Create a provider component
export const AvailabilityProvider = ({ children }) => {
    const [availableDates, setAvailableDates] = useState([]); // Default to an empty array

    return (
        <AvailabilityContext.Provider value={{ availableDates, setAvailableDates }}>
            {children}
        </AvailabilityContext.Provider>
    );
};