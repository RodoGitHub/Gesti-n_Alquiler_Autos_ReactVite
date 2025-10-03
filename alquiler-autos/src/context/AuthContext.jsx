import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading"); 

 
  const fetchAndSetUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("unauthenticated");
      return;
    }

    try {
      const res = await axios.get("http://localhost:3000/register/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
      setStatus("authenticated");
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem("token");
      setUser(null);
      setStatus("unauthenticated");
    }
  };

  useEffect(() => {
    fetchAndSetUser();
  }, []);

 
  const signIn = async (credentials) => {
    try {
      const res = await axios.post("http://localhost:3000/register/login", credentials);
      localStorage.setItem("token", res.data.token);
      await fetchAndSetUser();
    } catch (error) {
      console.error("Error de login:", error);
      throw error;
    }
  };

  
  const signOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    setStatus("unauthenticated");
  };

  return (
    <AuthContext.Provider value={{ user, status, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
