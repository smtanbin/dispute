import {
  maskPAN,
  maskPhone,
  maskEmail,
  maskAccount,
} from "../../../../utils/maskData"

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

interface DisputeCardProps {
  searchResult: DisputeRecord
  handlePrint: () => void
}

function DisputeCard({ searchResult, handlePrint }: DisputeCardProps) {
  return (
    <div className="card bg-base-100/30 backdrop-blur-md shadow-xl mt-8 max-w-2xl mx-auto">
      <div className="card-body">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="card-title text-2xl mb-2">
              Dispute #{searchResult.id}
            </h2>
            <div className="flex gap-2 items-center">
              <div
                className={`badge ${
                  searchResult.status === "resolved"
                    ? "badge-success"
                    : searchResult.status === "pending"
                    ? "badge-warning"
                    : "badge-error"
                } badge-lg`}
              >
                {searchResult.status.toUpperCase()}
              </div>
              <span className="text-sm opacity-70">
                Last Updated: {new Date(searchResult.updated).toLocaleString()}
              </span>
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={handlePrint}>
            Print Details
          </button>
        </div>

        <div className="divider"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold mb-2">Transaction Details</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Amount:</span>
              <span className="badge badge-neutral">{searchResult.amount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">PAN:</span>
              <span className="badge badge-neutral">
                {maskPAN(searchResult.PAN)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Terminal:</span>
              <span className="badge badge-neutral">
                {searchResult.terminalid}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Merchant:</span>
              <span className="text-sm">{searchResult.merchant}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Location:</span>
              <span className="text-sm">{searchResult.location}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold mb-2">Customer Details</h3>
            {searchResult.expand?.customer ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">Customer ID:</span>
                  <span className="badge">
                    {searchResult.expand.customer.cfid}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">Name:</span>
                  <span className="text-sm">
                    {searchResult.expand.customer.name}
                  </span>
                </div>
                {searchResult.expand.customer.account && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">Account:</span>
                    <span className="text-sm">
                      {maskAccount(searchResult.expand.customer.account)}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">Contact:</span>
                  <div className="flex flex-col">
                    {searchResult.expand.customer.email && (
                      <span className="text-sm">
                        📧 {maskEmail(searchResult.expand.customer.email)}
                      </span>
                    )}
                    {searchResult.expand.customer.phone && (
                      <span className="text-sm">
                        📞 {maskPhone(searchResult.expand.customer.phone)}
                      </span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-sm text-warning">
                Customer details not available
              </div>
            )}
          </div>
        </div>

        <div className="divider"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold mb-2">Dates</h3>
            <div className="text-sm">
              <p>
                <b>Transaction:</b>{" "}
                {new Date(searchResult.transaction_date).toLocaleString()}
              </p>
              <p>
                <b>Report Date:</b>{" "}
                {new Date(searchResult.created).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold mb-2">Resolution</h3>
            <div className="text-sm">
              <p>
                <b>Phoenix Status:</b> {searchResult.phoenix_status}
              </p>
              <p>
                <b>Issue By:</b> {searchResult.issue_by}
              </p>
            </div>
          </div>
        </div>

        <div className="divider"></div>

        <div className="bg-base-200/50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Remarks</h3>
          <p className="text-sm whitespace-pre-wrap">{searchResult.remarks}</p>
        </div>
      </div>
    </div>
  )
}

export default DisputeCard
