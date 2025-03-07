import { BrowserRouter, Route, Routes } from "react-router"
import HomePage from "../components/Pages/HomePage/HomePage"
import Users from "../components/Pages/User/Users"
import UnauthorizedPage from "../components/Pages/UnauthorizedPage/UnauthorizedPage"
import SecureRouter from "./secureRouter"
import LandingPage from "../components/Landing/LandingPage"
import Dispute from "../components/Pages/Dispute/Dispute"
import AddDispute from "../components/Pages/Dispute/AddDispute"
import Dashboard from "../components/Pages/Dashboard/Dashboard"
import PublicDispute from "../components/Pages/Dispute/PublicDispute/PublicDispute"
import DisputeDetails from "../components/Pages/Dispute/DisputeDetails"
import PendingDispute from "../components/Pages/Dispute/PendingDispute"
import PublicDisputeStatement from "../components/Pages/Dispute/PublicDispute/Statment"

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="login" element={<HomePage />} />
        <Route path="disputeRegister" element={<PublicDispute />} />
        <Route path="disputeStatement" element={<PublicDisputeStatement />} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />

        {/* Secure routes wrapped in LandingPage layout */}
        <Route element={<SecureRouter />}>
          <Route element={<LandingPage />}>
            <Route path="home" element={<Dashboard />} />
            <Route path="dispute">
              <Route index element={<Dispute />} />
              <Route path="add" element={<AddDispute />} />
              <Route path="pending" element={<PendingDispute />} />
              <Route path="info/:id" element={<DisputeDetails />} />
            </Route>
            <Route path="users" element={<Users />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
