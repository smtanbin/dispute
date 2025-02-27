import { useNavigate } from "react-router"
import { useEffect, useState } from "react"
import pb from "../../services/pocketBaseClient"
import { ROLES, hasRole } from "../../utils/roles"

// Define all available themes
const THEMES = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave",
  "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua",
  "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula",
  "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee",
  "winter", "dim", "nord", "sunset"
];

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
  const [theme, setTheme] = useState<string>(
    localStorage.getItem("theme") || "lemonade"
  )
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)

  useEffect(() => {
    let ignore = false

    const loadUser = async () => {
      try {
        if (pb.authStore.isValid && pb.authStore.record?.id) {
          const userData = pb.authStore.record
          if (!ignore) {
            setUser({
              id: userData.id,
              email: userData.email,
              username: userData.username,
              avatar: userData.avatar
                ? pb.files.getURL(userData, userData.avatar, { thumb: '100x100' })
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

  const handleLogout = () => {
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

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    setThemeMenuOpen(false)
  }

  if (!user) return null

  return (
    <div className="navbar bg-primary/50 backdrop-blur fixed top-0 z-50">
      <div className="flex-1">
        <a className="btn btn-ghost text-base-content text-xl" href="/">
          <img
            src="/logo.svg"
            alt="DMS"
            width="24"
            height="24"
            className="h-6 w-6 fill-current"
          /> DMS
        </a>

        {/* Services Dropdown */}
        <div className="dropdown dropdown-hover">
          <div tabIndex={0} role="button" className="btn btn-ghost m-1">
            Dispute
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
            className="dropdown-content z-[1] menu p-2 shadow bg-base-300 rounded-box w-52"
          >
            {/* Common menu items for all users */}
            <li><a className="text-primary" onClick={() => navigate("/dispute/pending")}>
              Pending List</a></li>
            {/* Common menu items for all users */}
            <li><a className="text-primary" onClick={() => navigate("/dispute")}>
              Dispute List</a></li>
          </ul>
        </div>
      </div>

      <div className="flex-none gap-2">
        {/* Theme selector dropdown */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle"
            onClick={() => setThemeMenuOpen(prev => !prev)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </div>
          <div
            tabIndex={0}
            className={`mt-3 z-[1] card card-compact dropdown-content w-64 bg-base-300 shadow ${!themeMenuOpen && 'hidden'}`}
          >
            <div className="card-body">
              <h3 className="card-title text-sm">Theme</h3>
              <div className="grid grid-cols-3 gap-2 pt-2">
                {THEMES.map(t => (
                  <button
                    key={t}
                    className={`btn btn-xs ${theme === t ? 'btn-active' : ''}`}
                    onClick={() => handleThemeChange(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && <span className="text-error text-sm">{error}</span>}

      {/* User avatar dropdown */}
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
          className="mt-3 z-[1] p-3 shadow menu menu-sm dropdown-content bg-base-300 rounded-box w-52"
        >
          {user && hasRole(user.role, ROLES.ADMIN) && (
            <>
              <li><a className="text-primary" onClick={() => navigate("/users")}>Users</a></li>
              <li>
                <a className="text-primary" href="http://127.0.0.1:8090/_/" >Admin</a>
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
