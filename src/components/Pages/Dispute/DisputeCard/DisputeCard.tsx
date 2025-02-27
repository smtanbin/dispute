import docType from "../../../../utils/docType"
import DisputeSteps from "../DisputeSteps"

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
  tr_type: string
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
  searchResult: DisputeRecord;
  handlePrint: (record: DisputeRecord) => void;
}

function DisputeCard({ searchResult, handlePrint }: DisputeCardProps) {
  return (
    <div className="card bg-base-200 h-full">
      <div className="card-body p-2 md:p-4 space-y-2">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold">Dispute #{searchResult.id}</h2>
            <p className="text-sm opacity-70">Created: {new Date(searchResult.created).toLocaleString()}</p>
          </div>
          <button onClick={() => handlePrint(searchResult)} className="btn btn-primary btn-sm">
            Print Details
          </button>
        </div>

        <DisputeSteps status={searchResult.status.toLowerCase()} />
        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-x-auto">
          {/* Transaction Details */}
          <div className="space-y-2">
            <h3 className="font-semibold">Transaction Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="opacity-70">Amount:</span>
              <span>{searchResult.amount}</span>
              <span className="opacity-70">Issueed By:</span>
              <span>{searchResult.issue_by}</span>
              <span className="opacity-70">DOC Number:</span>
              <span>{searchResult.doc_no}</span>
              <span className="opacity-70">Location:</span>
              <span>{searchResult.location}</span>
            </div>
          </div>


          {/* Status Details */}
          <div className="space-y-2">
            <h3 className="font-semibold">Status Information</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="opacity-70">Status:</span>
              <span className="badge badge-primary">{searchResult.status}</span>
              <span className="opacity-70">Dispute at:</span>
              <span>{docType(searchResult.tr_type)}</span>
              <span className="opacity-70">Switch Status:</span>
              <span>{searchResult.phoenix_status}</span>
              <span className="opacity-70">Updated:</span>
              <span>{new Date(searchResult.updated).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Remarks */}
        <div className="space-y-2">
          <h3 className="font-semibold">Remarks</h3>
          <p className="text-sm whitespace-pre-wrap bg-base-300/50 p-3 rounded-lg">
            {searchResult.remarks || "No remarks"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default DisputeCard;
