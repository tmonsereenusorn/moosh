import React, { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authorized, setAuthorized] = useState(!!Cookies.get("token"))
  const [loading, setLoading] = useState(false);

  return (
    <AuthContext.Provider value={{ authorized, setAuthorized, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};