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

interface Notification {
  id: string;
  message: string;
  created: string;
  target: string | null;
  seen: string[];
}

function Navbar() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [theme, setTheme] = useState<string>(
    localStorage.getItem("theme") || "lemonade"
  )
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Fetch notifications
  const getNotification = async () => {
    try {
      if (pb.authStore.isValid && pb.authStore.record?.id) {
        const data: any = await pb.collection('notification').getFullList({
          sort: '-created',
          limit: 400,
          filter: `active = true`,
        });

        const userId = pb.authStore.record?.id;
        if (userId) {
          setNotifications(data.filter((n: Notification) => !n.seen.includes(userId)));
        }
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }

  // Mark a notification as seen
  const handleDismissNotification = async (notificationId: string) => {
    try {
      if (pb.authStore.isValid && pb.authStore.record?.id) {
        const notification = await pb.collection('notification').getOne(notificationId);

        // Add the current user ID to the seen array if not already present
        const seen = notification.seen || [];
        if (!seen.includes(pb.authStore.record.id)) {
          seen.push(pb.authStore.record.id);

          await pb.collection('notification').update(notificationId, {
            seen: seen
          });

          // Update the local notifications state
          setNotifications(prev => prev.filter(n => n.id !== notificationId));
        }
      }
    } catch (error) {
      console.error("Error marking notification as seen:", error);
    }
  };

  // Format notification time relative to now
  const formatNotificationTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  useEffect(() => {
    getNotification()
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
    <div className="navbar  backdrop-blur fixed top-0 z-50">
      <div className="flex-1">
        <a className="btn btn-ghost text-base-content text-xl" href="/home">
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
            <li><a className="text-primary" onClick={() => navigate("/disputeStatement")}>
              Check Transactions</a></li>
          </ul>
        </div>
      </div>

      <div className="flex-none gap-2">
        {/* Notifications dropdown */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle"
            onClick={() => setNotificationMenuOpen(prev => !prev)}
          >
            <div className="indicator">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifications.length > 0 && (
                <span className="badge badge-xs badge-primary indicator-item">{notifications.length}</span>
              )}
            </div>
          </div>

          <div
            tabIndex={0}
            className={`mt-3 z-[1] card card-compact dropdown-content w-96 bg-base-200 shadow-xl ${!notificationMenuOpen && 'hidden'}`}
          >
            <div className="card-body">
              <div className="flex justify-between items-center border-b border-base-300 pb-2">
                <h3 className="font-bold text-lg">Notifications</h3>
                <span className="badge badge-sm">{notifications.length} new</span>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  <ul className="menu bg-base-200 gap-1">
                    {notifications.map((notification) => (
                      <li key={notification.id}>


                        <div className="card bg-base-100 shadow-xl mb-2">
                          <h2 className="card-title">      <span className="text-xs opacity-70">
                            {formatNotificationTime(notification.created)}
                          </span></h2>

                          <div className="card-body p-4">
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <div
                                className="prose prose-sm max-w-full"
                                dangerouslySetInnerHTML={{ __html: notification.message }}
                              ></div>
                              {/* <button
                                className="btn btn-ghost btn-xs"
                                onClick={() => handleDismissNotification(notification.id)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                                  viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round"
                                    strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button> */}
                            </div>
                            <div className="card-actions justify-end w-full">

                              <button
                                className="btn btn-xs btn-primary ml-auto"
                                onClick={() => handleDismissNotification(notification.id)}
                              >
                                Dismiss
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="py-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <p className="text-sm opacity-70 mt-2">No notifications</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

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
            className={`mt-3 z-[1] card card-cFompact dropdown-content w-64 bg-base-200 shadow-xl ${!themeMenuOpen && 'hidden'
              }`}
          >
            <div className="card-body p-4 ">
              <h3 className="card-title text-md mb-2">Select Theme</h3>
              <ul className="menu menu-compact overflow-y-auto max-h-60">
                {THEMES.map((t) => (
                  <li key={t}>
                    <button
                      className={`btn btn-sm normal-case ${theme === t ? 'btn-active btn-primary' : ''
                        }`}
                      onClick={() => handleThemeChange(t)}
                    >
                      {t}
                    </button>
                  </li>
                ))}
              </ul>
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
            className="mt-3 z-[1] p-4 shadow menu dropdown-content bg-base-300 rounded-box w-64"
          >
            <li className="border-b border-base-content/10 pb-2 mb-2">
              <div className="flex flex-col gap-1 p-2">
                <span className="font-bold text-lg">{getDisplayName(user)}</span>
                <span className="text-xs opacity-70">{user.email}</span>
                {user.role && <div className="badge badge-sm badge-primary">{user.role}</div>}
              </div>
            </li>

            <li><a className="flex items-center gap-2" onClick={() => navigate("/profile")}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </a></li>

            {user && hasRole(user.role, ROLES.ADMIN) && (
              <>
                <li><a className="flex items-center gap-2" onClick={() => navigate("/users")}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Manage Users
                </a></li>
                <li><a className="flex items-center gap-2" href="http://127.0.0.1:8090/_/" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Admin Panel
                </a></li>
              </>
            )}

            <li className="mt-2 border-t border-base-content/10 pt-2">
              <a className="flex items-center gap-2 text-red-500" onClick={handleLogout}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar
