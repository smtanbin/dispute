import { Outlet } from "react-router"
import Navbar from "../Navbar/Navbar"

function LandingPage() {
  return (
    <>
      <Navbar />
      <div className="mt-16"></div>
      <Outlet />
    </>
  )
}

export default LandingPage
