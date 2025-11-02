import { Routes,Router, Route } from "react-router-dom";
import { Fragment } from "react";

import { UserProvider } from "./contexts/UserContext";

import AuthRoutes from "./pages/auth";
import UserRoutes from "./pages/user";
import HomeRoutes from "./pages/home"; 

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
      </Routes>
    </Fragment>
  );
}

export default App;