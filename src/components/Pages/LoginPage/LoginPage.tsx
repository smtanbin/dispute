import { useForm } from "react-hook-form"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import pb from "../../../services/pocketBaseClient"
import Background from "../../Background/Background"

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthChecking, setIsAuthChecking] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    let ignore = false

    const checkAuth = async () => {
      try {
        if (pb.authStore.isValid) {
          await pb.collection("users").authRefresh()
          if (!ignore) {
            navigate("/", { replace: true })
          }
        }
      } catch (err) {
        if (!ignore) {
          pb.authStore.clear()
        }
      } finally {
        if (!ignore) {
          setIsAuthChecking(false)
        }
      }
    }

    checkAuth()
    return () => {
      ignore = true
    }
  }, [navigate])

  if (isAuthChecking) {
    return (
      <Background>
        <div className="min-h-screen flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </Background>
    )
  }

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true)
      setError("")
      await pb.collection("users").authWithPassword(data.email, data.password)
      navigate("/", { replace: true })
    } catch (e) {
      setError("Invalid email or password")
      setIsLoading(false)
    }
  }

  return (
    <Background>
      <div className="min-h-screen flex items-center justify-center">
        <div className="card w-96 bg-base-100/70 backdrop-blur">
          <form onSubmit={handleSubmit(onSubmit)} className="card-body">
            <h2 className="card-title justify-center text-2xl">Login</h2>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Email"
                className={`input input-bordered w-full ${
                  errors.email ? "input-error" : ""
                }`}
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.email.message as string}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Password"
                className={`input input-bordered w-full ${
                  errors.password ? "input-error" : ""
                }`}
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.password.message as string}
                  </span>
                </label>
              )}
            </div>

            {error && <div className="text-error text-center">{error}</div>}

            <div className="card-actions justify-end">
              <button
                type="submit"
                className={`btn btn-primary w-full ${
                  isLoading ? "loading" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Background>
  )
}

export default LoginPage
