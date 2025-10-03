import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./layouts/shell/MainLayout";
import HomeView from "./layouts/home/HomeView";
import LoginForm from "./layouts/auth/LoginForm";
import RegisterForm from "./layouts/auth/RegisterForm";
import UserForm from "./layouts/users/UserForm";
import UserList from "./layouts/users/UserList";
import ProductForm from "./layouts/products/ProductForm"; 
import GlobalLoader from "./layouts/shell/GlobalLoader";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GlobalLoader />

        <Routes>
          {/* Rutas de autenticación */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* Rutas dentro del layout principal */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomeView />} />
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
