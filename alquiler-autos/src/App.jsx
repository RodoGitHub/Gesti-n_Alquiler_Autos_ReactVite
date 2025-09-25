import { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GlobalLoader from "./components/GlobalLoader"; 

import Home from "./layouts/home";
import AuthRoutes from "./layouts/auth";

import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from './utils/PrivateRoute';


function App() {
  return (
    <Router>
        <AuthProvider>
          <Fragment>
            <GlobalLoader />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth/*" element={<AuthRoutes /> } />
            </Routes>
          </Fragment>
        </AuthProvider>
      </Router>
  )
}

export default App
