import { useNavigate } from "react-router"

export default function UnauthorizedPage() {
  const navigate = useNavigate()

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold text-error">401</h1>
          <p className="py-6">Sorry, you don't have permission to access this page.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate("/")}
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  )
}
