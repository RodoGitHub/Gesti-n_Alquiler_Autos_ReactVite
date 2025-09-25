import { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GlobalLoader from "./GlobalLoader"; 

import Home from './layouts/home/index';

import { AuthProvider } from "./auth/AuthProvider";
import { CustomersProvider } from "./customers/CustomersProvider";
import { UsersProvider } from "./users/UserProvider";

function App() {
  return (
    <Router>
        <AuthProvider>
          <Fragment>
            <GlobalLoader />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path='/inicio-sesion' element={<LoginForm/>}/>
              <Route path='/registro' element={<RegisterForm/>}/>
              <Route path='/clave-olvidada' element={<ForgotPassword/>}/>
              <Route path='/recuperar-contraseña' element={<ResetPassword/>}/>
              <Route
                path="/usuarios/*"
                element={
                  <PrivateRoute>
                    <UsersProvider>
                      <UsersRoutes />
                    </UsersProvider>
                  </PrivateRoute>
                }
              />
              <Route
                path="/clientes/*"
                element={
                  <PrivateRoute>
                    <CustomersProvider>
                      <CustomersRoutes />
                    </CustomersProvider>
                  </PrivateRoute>
                }
              />
              <Route
                path="/autos/*"
                element={
                  <PrivateRoute>
                    <AutosProvider>
                      <AutosRoutes />
                    </AutosProvider>
                  </PrivateRoute>
                }
              />
              <Route
                path="/alquileres/*"
                element={
                  <PrivateRoute>
                    <RentalsProvider>
                      <RentalsRoutes />
                    </RentalsProvider>
                  </PrivateRoute>
                }
              />
            </Routes>
          </Fragment>
        </AuthProvider>
      </Router>
  )
}

export default App
