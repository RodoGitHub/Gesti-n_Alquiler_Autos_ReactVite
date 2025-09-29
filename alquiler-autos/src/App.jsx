import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./layouts/home/Home";
import AuthRoutes from "./layouts/auth";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/*" element={<AuthRoutes />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
