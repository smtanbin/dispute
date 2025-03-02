import { useState, Suspense } from "react"
import { useNavigate } from "react-router"
import pb from "../../../services/pocketBaseClient"
import Background from "../../Background/Background"

import LoginForm from "../Auth/LoginForm";
import DisputeCard from "../Dispute/DisputeCard/DisputeCard";
import handlePrint from "./handelPrint";


function HomePage() {
  // const [disputes, setDisputes] = useState(null);
  const [disputeId, setDisputeId] = useState("")
  const [searchResult, setSearchResult] = useState<any>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // useEffect(() => {
  //   if (!pb.authStore.isValid) {
  //     navigate("/");
  //   } else {
  //     const loadDisputes = async () => {
  //       try {
  //         const result: any = await pb.collection('dispute').getList(1, 10, {
  //           sort: '-created',
  //         });
  //         // setDisputes(result);
  //       } catch (error) {
  //         console.error('Failed to load disputes:', error);
  //       }
  //     };
  //     loadDisputes();
  //   }
  // }, [navigate]);

  const handleSearch = async () => {
    if (!disputeId.trim()) return

    setIsLoading(true)
    setError("")
    setSearchResult(null)

    try {
      const record: any = await pb
        .collection("disputes")
        .getOne(disputeId.toLowerCase(), {
          expand: "customer",

        })
      setSearchResult(record)
    } catch (err: any) {
      console.error("Search failed:", err)
      if (err.status === 404) {
        setError("Dispute ID not found")
      } else {
        setError("Failed to search dispute. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Background>
      <div className="bg-base min-h-screen">
        <div className="container mx-auto p-6">
          <Suspense fallback={<div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>}>
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left side login card */}
              <div className="lg:w-2/3 w-full lg:sticky lg:top-6 self-start">
                <div className="card bg-base-100/70 backdrop-blur shadow-xl">
                  <div className="card-body">
                    <div className="space-y-4">
                      <div className="text-center">

                        <p className="text-lg opacity-90">
                          Search for a dispute or report a new one
                        </p>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="form-control flex-1">
                          <div className="input-group">
                            <input
                              type="text"
                              placeholder="Enter Dispute ID..."
                              className="input input-bordered w-full"
                              value={disputeId}
                              onChange={(e) => setDisputeId(e.target.value)}
                            />
                          </div>
                        </div>
                        <button
                          className={`btn ${isLoading ? "loading" : ""}`}
                          onClick={handleSearch}
                          disabled={isLoading || !disputeId.trim()}
                        >
                          {!isLoading && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                              />
                            </svg>
                          )}
                          Search
                        </button>
                        <button
                          className="btn btn-primary w-full md:w-auto"
                          onClick={() => navigate("/disputeRegister")}
                        >
                          Report Dispute
                        </button>
                      </div>

                      {error && (
                        <div className="alert alert-error">
                          <span>{error}</span>
                        </div>
                      )}

                      {searchResult && (
                        <div className="mt-4 overflow-auto">
                          <DisputeCard
                            searchResult={searchResult}
                            handlePrint={handlePrint}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side content card */}
              <div className="lg:w-1/3 w-full">
                <LoginForm />

              </div>
            </div>
          </Suspense>
        </div>
      </div>
    </Background>
  );
}

export default HomePage;
