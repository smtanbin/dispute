import { Outlet } from "react-router"
import Navbar from "../Navbar/Navbar"

function LandingPage() {
  return (
    <>
      <Navbar />
      <div className="mt-16 h-screen overflow-auto">

        <Outlet />
      </div>
    </>
  )
}

export default LandingPage
