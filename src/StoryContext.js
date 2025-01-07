// src/StoryContext.js
import React, { createContext, useState } from 'react'; //ok

export const StoryContext = createContext();

export const StoryProvider = ({ children }) => {
    const [selectedStory, setSelectedStory] = useState('');

    return (
        <StoryContext.Provider value={{ selectedStory, setSelectedStory }}>
            {children}
        </StoryContext.Provider>
    );
};
