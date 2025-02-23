import { BrowserRouter, Route, Routes } from "react-router"
import HomePage from "../components/Pages/HomePage/HomePage"
import Users from "../components/Pages/User/Users"
import LoginPage from "../components/Pages/LoginPage/LoginPage"

import SecureRouter from "./secureRouter"
import LandingPage from "../components/Landing/LandingPage"

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<SecureRouter />}>
          <Route element={<LandingPage />}>
            <Route index element={<HomePage />} />
            <Route path="users">
              <Route index element={<Users />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
