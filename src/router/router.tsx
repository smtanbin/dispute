import { BrowserRouter, Route, Routes } from "react-router"
import HomePage from "../components/Pages/HomePage/HomePage"
import Users from "../components/Pages/User/Users"
import LoginPage from "../components/Pages/LoginPage/LoginPage"
import UnauthorizedPage from "../components/Pages/UnauthorizedPage/UnauthorizedPage"

import SecureRouter from "./secureRouter"
import LandingPage from "../components/Landing/LandingPage"
import Dispute from "../components/Pages/Dispute/Dispute"
import AddDispute from "../components/Pages/Dispute/AddDispute"


function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<SecureRouter />}>
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route element={<LandingPage />}>
            <Route index element={<HomePage />} />
            <Route path="/dispute" element={<Dispute />} />
            <Route path="/dispute/new" element={<AddDispute />} />
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
