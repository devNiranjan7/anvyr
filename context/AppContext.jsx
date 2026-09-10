"use client";

import { useUser } from "@clerk/nextjs";
import { createContext } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const { user } = useUser();
    const value = {
        user,
    };
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
