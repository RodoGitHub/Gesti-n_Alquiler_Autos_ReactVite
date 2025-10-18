import { useState } from "react";
import { useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toast } from "primereact/toast";

import MainLayout from "./components/MainLayout";
import GlobalLoader from "./components/GlobalLoader";
import DashboardView from "./components/DashboardView";

import HomeView from "./layouts/home/HomeView";
import LoginForm from "./layouts/auth/LoginForm";
import RegisterForm from "./layouts/auth/RegisterForm";
import UserForm from "./layouts/users/UserForm";
import UserList from "./layouts/users/UserList";
import ProductForm from "./layouts/products/ProductForm"; 

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

function App() {
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);


  return (
    <BrowserRouter>
      <AuthProvider>
        {loading && <GlobalLoader />}

        <Toast ref={toast} position="top-right"/>
        
        <Routes>
          <Route path="/login" element={<LoginForm setLoading={setLoading} toast={toast}/>} />
          <Route path="/register" element={<RegisterForm toast/>} />
          
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardView />} />
            <Route path="/usuarios" element={<UserList />} />
            <Route path="/usuarios/nuevo" element={<UserForm />} />
            <Route path="/productos" element={<ProductForm />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
