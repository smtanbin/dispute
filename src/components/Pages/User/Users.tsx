import { useEffect, useState } from "react"
import pb from "../../../services/pocketBaseClient"
import { useForm } from "react-hook-form"

interface User {
  id: string
  email: string
  name?: string // Changed from username
  verified: boolean
  created: string
  updated: string
  role: string
  expand?: {
    role: Role
  }
}

interface Role {
  id: string
  role: string
  created: string
  updated: string
}

interface UserFormData {
  email: string
  password: string
  passwordConfirm: string
  name?: string // Changed from username
  role: string
  avatar?: FileList  // Add this line
}

interface PasswordChangeForm {
  password: string
  passwordConfirm: string
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [roleError, setRoleError] = useState("") // Add this line
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>()

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordChangeForm>()

  // Add this function outside the useEffect
  const loadUsers = async () => {
    try {
      setLoading(true)
      const records = await pb.collection("users").getFullList({
        sort: "-created",
        expand: "role",
      })
      console.log("Users with roles:", records) // Debug log
      setUsers(records.map(record => ({
        id: record.id,
        email: record.email,
        name: record.name,
        verified: record.verified,
        created: record.created,
        updated: record.updated,
        role: record.role,
        expand: record.expand ? { role: record.expand.role as Role } : undefined,
      })))
      setError("")
    } catch (err) {
      console.error("Failed to load users:", err)
      setError("Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let ignore = false
    const abortController = new AbortController()

    const loadRoles = async () => {
      try {
        if (!pb.authStore.isValid) {
          setRoleError("Authentication required")
          return
        }

        const records = await pb.collection('roles').getFullList({
          sort: '-created',
          filter: 'status = true',
          fields: 'collectionName,role,id',
          $autoCancel: false,
          signal: abortController.signal
        })

        if (ignore) return

        if (records.length === 0) {
          setRoleError("No roles found")
          setRoles([])
        } else {
          // Transform records and map special roles
          const transformedRoles = records.map(record => ({
            id: record.id,
            role: record.role,
            created: '',
            updated: ''
          }))
          setRoles(transformedRoles)
          setRoleError("")
          await loadUsers()
        }
      } catch (err: any) {
        if (ignore) return
        console.error("Failed to load roles:", err)
        setRoleError(`Failed to load roles: ${err.message || "Unknown error"}`)
        setRoles([])
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }
    
    loadRoles()

    return () => {
      ignore = true
      abortController.abort()
    }
  }, [])

  const onSubmit = async (data: UserFormData) => {
    try {
      const formData = new FormData()
      
      // Add all text fields
      formData.append('email', data.email)
      formData.append('password', data.password)
      formData.append('passwordConfirm', data.passwordConfirm)
      formData.append('role', data.role)
      formData.append('emailVisibility', 'true')
      
      // Add optional fields
      if (data.name) formData.append('name', data.name)
      if (data.avatar?.[0]) formData.append('avatar', data.avatar[0])

      // Create user with FormData
      await pb.collection("users").create(formData)
      await loadUsers()
      setIsModalOpen(false)
      reset()
    } catch (err) {
      console.error("Failed to create user:", err)
      setError("Failed to create user")
    }
  }

  const onPasswordChange = async (data: PasswordChangeForm) => {
    try {
      if (!selectedUser) return
      await pb.collection("users").update(selectedUser.id, {
        password: data.password,
        passwordConfirm: data.passwordConfirm,
      })
      setIsPasswordModalOpen(false)
      resetPassword()
      setError("Password updated successfully")
    } catch (err) {
      console.error("Failed to update password:", err)
      setError("Failed to update password")
    }
  }

  if (loading)
    return (
      <div className="flex justify-center p-4">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Users</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
        >
          Add User
        </button>
      </div>

      {/* Add User Modal */}
      <dialog className={`modal ${isModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Add New User</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className={`input input-bordered ${
                  errors.email ? "input-error" : ""
                }`}
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <span className="text-error text-sm mt-1">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Add avatar upload before name field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Avatar</span>
              </label>
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full"
                {...register("avatar")}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                {...register("name")}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                className={`input input-bordered ${
                  errors.password ? "input-error" : ""
                }`}
                {...register("password", {
                  required: "Password is required",
                  minLength: 8,
                })}
              />
              {errors.password && (
                <span className="text-error text-sm mt-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                className={`input input-bordered ${
                  errors.passwordConfirm ? "input-error" : ""
                }`}
                {...register("passwordConfirm", {
                  required: "Please confirm password",
                  validate: (value, formValues) =>
                    value === formValues.password || "Passwords don't match",
                })}
              />
              {errors.passwordConfirm && (
                <span className="text-error text-sm mt-1">
                  {errors.passwordConfirm.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Role</span>
              </label>
              <select
                className={`select select-bordered w-full ${
                  errors.role ? "select-error" : ""
                }`}
                {...register("role", { required: "Role is required" })}
              >
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.role}
                  </option>
                ))}
              </select>
              {errors.role && (
                <span className="text-error text-sm mt-1">
                  {errors.role.message}
                </span>
              )}
            </div>

            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Create
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setIsModalOpen(false)
                  reset()
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsModalOpen(false)}>close</button>
        </form>
      </dialog>

      {/* Password Change Modal */}
      <dialog className={`modal ${isPasswordModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Change Password</h3>
          <form onSubmit={handlePasswordSubmit(onPasswordChange)}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">New Password</span>
              </label>
              <input
                type="password"
                className={`input input-bordered ${
                  passwordErrors.password ? "input-error" : ""
                }`}
                {...registerPassword("password", {
                  required: "Password is required",
                  minLength: 8,
                })}
              />
              {passwordErrors.password && (
                <span className="text-error text-sm mt-1">
                  {passwordErrors.password.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                className={`input input-bordered ${
                  passwordErrors.passwordConfirm ? "input-error" : ""
                }`}
                {...registerPassword("passwordConfirm", {
                  required: "Please confirm password",
                  validate: (value, formValues) =>
                    value === formValues.password || "Passwords don't match",
                })}
              />
              {passwordErrors.passwordConfirm && (
                <span className="text-error text-sm mt-1">
                  {passwordErrors.passwordConfirm.message}
                </span>
              )}
            </div>

            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Update Password
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setIsPasswordModalOpen(false)
                  resetPassword()
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsPasswordModalOpen(false)}>close</button>
        </form>
      </dialog>

      {roleError && <div className="alert alert-error mb-4">{roleError}</div>}
      {error && <div className="alert alert-error mb-4">{error}</div>}

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Role</th>
       
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="flex items-center gap-2">
                  {user.verified && (
                    <div className="w-2 h-2 rounded-full bg-success" title="Verified"></div>
                  )}
                  {user.email}
                </td>
                <td>{user.name || "-"}</td>
                <td>
                  <div className="badge badge-outline">
                    {user.expand?.role?.role || "Unknown Role"}
                  </div>
                </td>
              
                <td>{new Date(user.created).toLocaleDateString()}</td>
                <td>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedUser(user)
                        setIsPasswordModalOpen(true)
                      }}
                      className="btn btn-sm btn-outline"
                    >
                      Change Password
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}



