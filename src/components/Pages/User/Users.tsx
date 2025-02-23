import { useEffect, useState } from "react"
import pb from "../../../services/pocketBaseClient"
import { useNavigate } from "react-router"
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
  name: string
  created: string
  updated: string
}

interface UserFormData {
  email: string
  password: string
  passwordConfirm: string
  name?: string // Changed from username
  role: string
}

function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>()

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const records = await pb.collection("roles").getFullList()
        setRoles(records)
      } catch (err) {
        console.error("Failed to load roles:", err)
      }
    }
    loadRoles()
  }, [])

  useEffect(() => {
    let ignore = false

    const loadUsers = async () => {
      try {
        setLoading(true)
        // Fix: Add proper expand parameter
        const records = await pb.collection("users").getFullList({
          sort: "-created",
          expand: "role",
          fields: "id,email,name,created,role,expand.role.name", // Specify fields to fetch
        })
        if (!ignore) {
          console.log("Users with roles:", records) // Debug log
          setUsers(records)
        }
      } catch (err) {
        if (!ignore) {
          // Only update state if component is still mounted
          console.error("Failed to load users:", err)
          setError("Failed to load users")
        }
      } finally {
        if (!ignore) {
          // Only update state if component is still mounted
          setLoading(false)
        }
      }
    }

    loadUsers()

    // Cleanup function
    return () => {
      ignore = true
    }
  }, [])

  const onSubmit = async (data: UserFormData) => {
    try {
      // Update: Add role to user creation
      await pb.collection("users").create({
        ...data,
        emailVisibility: true,
        role: data.role, // Ensure role is being sent
      })
      await loadUsers() // Refresh user list
      setIsModalOpen(false)
      reset() // Reset form
    } catch (err) {
      console.error("Failed to create user:", err)
      setError("Failed to create user")
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
                    {role.name}
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
                <td>{user.email}</td>
                <td>{user.name || "-"}</td>
                <td>
                  <div className="badge badge-outline">
                    {user.expand?.role?.name || "No Role"}
                  </div>
                </td>
                <td>{new Date(user.created).toLocaleDateString()}</td>
                <td>
                  {/* <button
                    onClick={() => navigate(`/users/edit/${user.id}`)}
                    className="btn btn-sm btn-outline mr-2"
                  >
                    Edit
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Users
