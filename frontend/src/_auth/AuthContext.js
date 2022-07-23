import React, {createContext, useContext} from "react";

import { useAuthValues } from "./hooks";

const AuthContext = createContext();

function useAuth() {
    return useContext(AuthContext);
}

function AuthContextProvider({ children }) {
    const auth = useAuthValues();
    
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    )
}

export { useAuth, AuthContextProvider }