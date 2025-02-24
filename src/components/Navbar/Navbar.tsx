import { useNavigate } from "react-router"
import { useEffect, useState } from "react"
import pb from "../../services/pocketBaseClient"
import { ROLES, hasRole } from "../../utils/roles"

interface User {
  id: string
  email: string
  username?: string // Make username optional
  avatar?: string
  created: string
  updated: string
  role: string
}

function Navbar() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [theme, setTheme] = useState<"lemonade" | "forest">(
    (localStorage.getItem("theme") as "lemonade" | "forest") || "lemonade"
  )

  useEffect(() => {
    let ignore = false

    const loadUser = async () => {
      try {
        if (pb.authStore.isValid && pb.authStore.model?.id) {
          const userData = pb.authStore.model
          if (!ignore) {
            setUser({
              id: userData.id,
              email: userData.email,
              username: userData.username,
              avatar: userData.avatar
                ? pb.files.getUrl(userData, userData.avatar, { thumb: '100x100' })
                : undefined,
              created: userData.created,
              updated: userData.updated,
              role: userData.role,
            })
          }
        }
      } catch (err) {
        if (!ignore) {
          console.error("Failed to load user:", err)
          setError("Failed to load user data")
        }
      }
    }

    loadUser()
    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleClose()
    pb.authStore.clear()
    setUser(null)
    navigate("/login")
  }

  const getInitial = (user: User) => {
    if (user.username) return user.username.charAt(0).toUpperCase()
    if (user.email) return user.email.charAt(0).toUpperCase()
    return "U" // Default fallback
  }

  const getDisplayName = (user: User) => {
    return user.username || user.email || "User" // Default fallback
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === "lemonade" ? "forest" : "lemonade"))
  }

  if (!user) return null

  return (
    <div className="navbar bg-base-100/50 backdrop-blur fixed top-0 z-50">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl" href="/">
          <img
            src="/logo.svg"
            alt="DMS"
            width="24"
            height="24"
            className="h-6 w-6 fill-current"
          /> DMS
        </a>

        {/* Update Services Dropdown */}
        <div className="dropdown dropdown-hover">
          <div tabIndex={0} role="button" className="btn btn-ghost m-1">
            Services
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >

            {/* Common menu items for all users */}
            <li><a onClick={() => navigate("/dispute")}>
              Dispute</a></li>
            {/* Add more role-based menu items as needed */}
          </ul>
        </div>
      </div>

      <div className="flex-none gap-2"></div>
      {error && <span className="text-error text-sm">{error}</span>}

      {/* Replace theme toggle button with swap */}
      <label className="swap swap-rotate mr-2">
        <input
          type="checkbox"
          className="theme-controller"
          value={theme}
          onChange={toggleTheme}
          checked={theme === "forest"}
        />

        {/* sun icon */}
        <svg
          className="swap-on fill-current w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
        </svg>

        {/* moon icon */}
        <svg
          className="swap-off fill-current w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
        </svg>
      </label>

      {/* Existing avatar dropdown */}
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
        >
          <div className="avatar placeholder">
            {user.avatar ? (
              <div className="w-10 rounded-full">
                <img src={user.avatar} alt={getDisplayName(user)} />
              </div>
            ) : (
              <div className="bg-primary text-neutral-content rounded-full w-10">
                <span>{getInitial(user)}</span>
              </div>
            )}
          </div>
        </div>
        <ul
          tabIndex={0}
          className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
        >

          {user && hasRole(user.role, ROLES.ADMIN) && (
            <>
              <li><a onClick={() => navigate("/users")}>Users</a></li>
              <li>
                <a href="http://127.0.0.1:8090/_/" >Admin</a>
              </li>

            </>
          )}
          <li>
            <a className="text-red-500" onClick={handleLogout}>Logout</a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Navbar
