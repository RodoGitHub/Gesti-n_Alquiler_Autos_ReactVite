import { Routes, Route } from "react-router-dom";
import { Fragment } from "react";

import PrivateRoute from "./utils/PrivateRoute";

import { UserProvider } from "./contexts/UserContext";
import { ClientProvider } from "./contexts/ClientContext";

import AppNavbar from "./components/layout/Navbar";
import AppFooter from "./components/layout/Footer";

import AuthRoutes from "./pages/auth";
import UserRoutes from "./pages/user";
import HomeRoutes from "./pages/home"; 
import ClientRoutes from "./pages/client";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";


function App() {
    return (
        <Fragment>
            <AppNavbar />
            <Routes>
                <Route 
                    path="/*" 
                    element={
                        <HomeRoutes />
                    } 
                />
                
                <Route 
                    path="/auth/*" 
                    element={
                        <AuthRoutes />
                    } 
                />
                <Route
                    path="/user/*"
                    element={           
                        <UserProvider>
                            <UserRoutes />
                        </UserProvider>
                    }
                />
                <Route
                    path="/client/*"
                    element={           
                        <ClientProvider>
                            <ClientRoutes />
                        </ClientProvider>
                    }
                />

                
            </Routes>
            <AppFooter />
        </Fragment>
    );
}

export default App;