import { Routes,Router, Route } from "react-router-dom";
import { Fragment } from "react";

import PrivateRoute from "./utils/PrivateRoute";

import { UserProvider } from "./contexts/UserContext";
import { ClientProvider } from "./contexts/ClientContext";

import AuthRoutes from "./pages/auth";
import UserRoutes from "./pages/user";
import HomeRoutes from "./pages/home"; 
import ClientRoutes from "./pages/client";

function App() {
    return (
        <Fragment>
            <Routes>
                <Route path="/*" element={<HomeRoutes />} />
                <Route 
                    path="/auth/*" 
                    element={<AuthRoutes />} 
                />
                <Route
                    path="/user/*"
                    element={           
                        <UserProvider>
                            <UserRoutes />
                        </UserProvider>
                    }
                />
                {/* Rutas privadas */}
                

                    <Route
                    path="/client/*"
                    element={
                        <PrivateRoute>            
                        <UserProvider>
                            <ClientProvider>
                            <ClientRoutes />
                            </ClientProvider>
                        </UserProvider>
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Fragment>
    );
}

export default App;