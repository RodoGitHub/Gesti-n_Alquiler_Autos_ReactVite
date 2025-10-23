import { useState, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Toast } from "primereact/toast";

import MainLayout from "./components/MainLayout";
import GlobalLoader from "./components/GlobalLoader";
import DashboardView from "./components/DashboardView";

import LoginForm from "./layouts/auth/LoginForm";
import RegisterForm from "./layouts/auth/RegisterForm";
import UserForm from "./layouts/users/UserForm";
import UserList from "./layouts/users/UserList";
import RentalList from "./layouts/products/RentalList";
import CarList from "./layouts/products/CarList";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

// Rutas privadas
function PrivateRoute({ children }) {
  const { user, status } = useAuth();
  if (status === "loading") return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);

  return (
    <BrowserRouter>
      <AuthProvider>
        {loading && <GlobalLoader />}
        <Toast ref={toast} position="top-right" />

        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<LoginForm setLoading={setLoading} toast={toast} />} />
          <Route path="/register" element={<RegisterForm toast={toast} />} />

          {/* Rutas privadas */}
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<DashboardView />} />
            <Route path="usuarios" element={<UserList />} />
            <Route path="usuarios/nuevo" element={<UserForm />} />
            <Route path="productos" element={<CarList />} />
            <Route path="reservas" element={<RentalList />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
