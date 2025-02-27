import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import pb from "../../../services/pocketBaseClient";

function LoginForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true)
      setError("")
      await pb.collection("users").authWithPassword(data.email, data.password)
      navigate("/home", { replace: true })
    } catch (e) {
      setError("Invalid email or password")
    } finally {

      setIsLoading(false)
    }
  }

  return (
    <div className="card bg-base-100/70 backdrop-blur shadow-xl w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="card-body">
        <div className="space-y-6">
          {/* Logo Section */}
          <div className="flex  flex-col items-center">
            <img src="/logo.svg" alt="DMS Logo" className="w-16 h-16 mb-2" />
            <h2 className="card-title text-2xl">DMS</h2>
          </div>

          <p>Login to continue</p>

          {/* Form Controls */}
          <div className="space-y-2">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Email"
                className={`input input-bordered w-full ${errors.email ? "input-error" : ""
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
                className={`input input-bordered w-full ${errors.password ? "input-error" : ""
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

            <div className="card-actions">
              <button
                type="submit"
                className={`btn btn-primary w-full ${isLoading ? "loading" : ""
                  }`}
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Copyright Footer */}
      <div className="p-4 text-center text-sm opacity-70 border-t">
        <p>© {new Date().getFullYear()} Standard Bank PLC.</p>
        <p>All rights reserved</p>
      </div>
    </div>
  );
}

export default LoginForm;
