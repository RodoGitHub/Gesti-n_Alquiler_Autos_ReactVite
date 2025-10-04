import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./layouts/shell/MainLayout";
import DashboardLayout from "./layouts/home"; 
import HomeView from "./layouts/home/HomeView";
import LoginForm from "./layouts/auth/LoginForm";
import RegisterForm from "./layouts/auth/RegisterForm";
import ForgotPassword from "./layouts/auth/ForgotPassword";
import ResetPassword from "./layouts/auth/ResetPassword";
import UserForm from "./layouts/users/UserForm";
import UserList from "./layouts/users/UserList";
import ProductForm from "./layouts/products/ProductForm"; 
import GlobalLoader from "./layouts/shell/GlobalLoader";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GlobalLoader />

        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/clave-olvidada" element={<ForgotPassword />} />
          <Route path="/recuperar-contraseña" element={<ResetPassword />} />

          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<HomeView />} />
            <Route path="/dashboard/usuarios" element={<UserList />} />
            <Route path="/dashboard/usuarios/nuevo" element={<UserForm />} />
            <Route path="/dashboard/productos" element={<ProductForm />} />
          </Route>

          <Route element={<MainLayout />}>
            <Route path="/" element={<HomeView />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
