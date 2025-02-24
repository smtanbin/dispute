import { Navigate, Outlet, useNavigate } from "react-router"
import { useEffect, useState } from "react"
import pb from "../services/pocketBaseClient"
import { hasRole, ROLES } from "../utils/roles"

interface ProtectedRouteProps {
  requiredRole?: string;
}

function SecureRouter({ requiredRole }: ProtectedRouteProps) {
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
            const userRole = pb.authStore.model?.role
            
            // First check if user is authenticated
            if (!userRole) {
              setIsAuthenticated(false)
              navigate("/login", { replace: true })
              return
            }

            // Then check if user has required role
            if (requiredRole && !hasRole(userRole, requiredRole)) {
              console.log(`User role ${userRole} does not have required role ${requiredRole}`)
              navigate("/unauthorized", { replace: true })
              return
            }

            setIsAuthenticated(true)
          }
        } else {
          if (!ignore) {
            setIsAuthenticated(false)
            navigate("/login", { replace: true })
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
  }, [navigate, requiredRole])

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
