import { useState } from "react"
import { useNavigate } from "react-router"
import pb from "../../../services/pocketBaseClient"
import Background from "../../Background/Background"
import {
  maskPAN,
  maskPhone,
  maskEmail,
  maskAccount,
} from "../../../utils/maskData"
import DisputeCard from "../Dispute/DisputeCard/DisputeCard"

interface DisputeClient {
  id: string
  name: string
  email: string
  phone: string
  address: string
  account: string
  cfid: string
}

interface DisputeRecord {
  id: string
  DMSRaiseDate: string
  PAN: string
  RRNSTAN: string
  acquirer: string
  amount: string
  channel: string
  complain_date: string
  customer: string
  doc_no: string
  issue_by: string
  location: string
  merchant: string
  phoenix_status: string
  status: string
  terminalid: string
  tr_amount: string
  transaction_date: string
  created: string
  updated: string
  remarks: string
  expand?: {
    customer: DisputeClient
  }
}

function HomePage() {
  const [disputeId, setDisputeId] = useState("")
  const [searchResult, setSearchResult] = useState<DisputeRecord | null>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSearch = async () => {
    if (!disputeId.trim()) return

    setIsLoading(true)
    setError("")
    setSearchResult(null)

    try {
      const record = await pb
        .collection("dispute")
        .getOne(disputeId.toLowerCase(), {
          expand: "customer",
          fields: `
          id,
          PAN,
          RRNSTAN,
          amount,
          doc_no,
          issue_by,
          location,
          merchant,
          phoenix_status,
          status,
          terminalid,
          transaction_date,
          created,
          updated,
          remarks,
          expand.customer.id,
          expand.customer.name,
          expand.customer.email,
          expand.customer.phone,
          expand.customer.account,
          expand.customer.cfid
        `,
        })

      console.log("Dispute with client:", record)
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

  const handlePrint = () => {
    const printContents = `
      <html>
        <head>
          <title>Dispute Details - ${searchResult?.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .section-title { font-weight: bold; margin-bottom: 10px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .label { font-weight: bold; margin-right: 10px; }
            .divider { border-top: 1px solid #ccc; margin: 20px 0; }
            .badge { 
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: bold;
            }
            .badge-success { background: #4caf50; color: white; }
            .badge-warning { background: #ff9800; color: white; }
            .badge-error { background: #f44336; color: white; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Dispute Details - #${searchResult?.id}</h1>
            <p>Generated on: ${new Date().toLocaleString()}</p>
          </div>
          
          <div class="section">
            <div class="grid">
              <div>
                <div class="section-title">Transaction Details</div>
                <p><span class="label">Amount:</span> ${
                  searchResult?.amount
                }</p>
                <p><span class="label">PAN:</span> ${maskPAN(
                  searchResult?.PAN
                )}</p>
                <p><span class="label">Terminal:</span> ${
                  searchResult?.terminalid
                }</p>
                <p><span class="label">Merchant:</span> ${
                  searchResult?.merchant
                }</p>
                <p><span class="label">Location:</span> ${
                  searchResult?.location
                }</p>
              </div>
              <div>
                <div class="section-title">Customer Details</div>
                <p><span class="label">Customer ID:</span> ${
                  searchResult?.expand?.customer?.cfid || "N/A"
                }</p>
                <p><span class="label">Name:</span> ${
                  searchResult?.expand?.customer?.name || "N/A"
                }</p>
                <p><span class="label">Account:</span> ${
                  searchResult?.expand?.customer?.account
                    ? maskAccount(searchResult.expand.customer.account)
                    : "N/A"
                }</p>
                <p><span class="label">Phone:</span> ${
                  searchResult?.expand?.customer?.phone
                    ? maskPhone(searchResult.expand.customer.phone)
                    : "N/A"
                }</p>
                <p><span class="label">Email:</span> ${
                  searchResult?.expand?.customer?.email
                    ? maskEmail(searchResult.expand.customer.email)
                    : "N/A"
                }</p>
              </div>
            </div>
          </div>
          <div class="divider"></div>
          <div class="section">
            <div class="grid">
              <div>
                <div class="section-title">Dates</div>
                <p><span class="label">Transaction Date:</span> ${new Date(
                  searchResult?.transaction_date || ""
                ).toLocaleString()}</p>
                <p><span class="label">Report Date:</span> ${new Date(
                  searchResult?.created || ""
                ).toLocaleString()}</p>
              </div>
              <div>
                <div class="section-title">Status</div>
                <p><span class="label">Current Status:</span> 
                  <span class="badge badge-${
                    searchResult?.status === "resolved"
                      ? "resolved"
                      : searchResult?.status === "pending"
                      ? "warning"
                      : "error"
                  }">
                    ${searchResult?.status?.toUpperCase()}
                  </span>
                </p>
                <p><span class="label">Phoenix Status:</span> ${
                  searchResult?.phoenix_status
                }</p>
                <p><span class="label">Issue By:</span> ${
                  searchResult?.issue_by
                }</p>
              </div>
            </div>
          </div>
          <div class="divider"></div>
          <div class="section">
            <div class="section-title">Remarks</div>
            <p>${searchResult?.remarks || "No remarks"}</p>
          </div>
        </body>
      </html>         
    `
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(printContents)
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
    }
  }

  return (
    <div className=" bg-base p-6">
      <div className="min-h-screen p-4">
        <div className="max-w-2xl mx-auto space-y-8 pt-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Dispute Management System
            </h1>
            <p className="text-lg opacity-90">
              Search for a dispute or report a new one
            </p>
          </div>
          <div className="card  mt-8 max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="form-control flex-1">
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Enter Dispute ID..."
                    className="input input-bordered w-full bg-base-100/50"
                    value={disputeId}
                    onChange={(e) => setDisputeId(e.target.value)}
                  />
                </div>
              </div>
              <button
                className={`btn ${isLoading ? "loading" : ""} bg-base-100/50`}
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
                onClick={() => navigate("/dispute/new")}
              >
                Report Dispute
              </button>
            </div>
          </div>
          {error && (
            <div className="alert alert-error bg-error/70 backdrop-blur-md">
              <span>{error}</span>
            </div>
          )}
          {searchResult && (
            <DisputeCard
              searchResult={searchResult}
              handlePrint={handlePrint}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage
