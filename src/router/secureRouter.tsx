import { Navigate, Outlet, useNavigate } from "react-router"
import { useEffect, useState } from "react"
import pb from "../services/pocketBaseClient"

function SecureRouter() {
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    let ignore = false

    const checkAuth = async () => {
      try {
        if (pb.authStore.isValid) {
          await pb.collection("users").authRefresh()
          if (!ignore) {
            setIsAuthenticated(true)
          }
        }
      } catch (err) {
        if (!ignore) {
          console.error("Auth check failed:", err)
          pb.authStore.clear()
          setIsAuthenticated(false)
          navigate("/login", { replace: true })
        }
      } finally {
        if (!ignore) {
          setIsChecking(false)
        }
      }
    }

    checkAuth()
    return () => {
      ignore = true
    }
  }, [navigate])

  if (isChecking) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export default SecureRouter
