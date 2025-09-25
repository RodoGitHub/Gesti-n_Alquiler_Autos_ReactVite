import { createContext, useEffect, useState } from "react";
import { resource } from "../services/api"; 

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading"); // 'loading' | 'authenticated' | 'unauthenticated'

  const userAuthResource = resource("auth/me", "userAuth")

  const fetchAndSetUser = () => {
    return userAuthResource.get()
      .then(res => {
        setUser(res.data);
        setStatus("authenticated");
      })
      .catch(() => {
        localStorage.removeItem("token");
        setStatus("unauthenticated");
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setStatus("unauthenticated");
    fetchAndSetUser();
  }, []);

  const signIn = async (credentials) => {
    try {
      const res = await api.post("auth/login", credentials);
      localStorage.setItem("token", res.data.token);
      await fetchAndSetUser();
    } catch (error) {
      console.error("Error de login", error);
      throw error;
    }
  };

  const signOut = () => {
        localStorage.removeItem("token");
        setUser(null);
        setStatus("unauthenticated");
    };

  return (
    <AuthContext.Provider 
        value={{ 
            user, 
            status, 
            signIn, 
            signOut 
            }}>
            {children}
    </AuthContext.Provider>
  );
}