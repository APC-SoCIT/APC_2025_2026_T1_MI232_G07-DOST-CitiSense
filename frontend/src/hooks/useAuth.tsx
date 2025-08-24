import React, { useContext } from "react";
import AuthenticationContext from "../context/AuthenticationContext";

//have a hook for easier access to the context value
const useAuth = () => {
  //get the context value so you can access its properties (user data and logout function)
  const context = useContext(AuthenticationContext);

  //throw an error for when accessing a page without a authprovider
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

export default useAuth;
