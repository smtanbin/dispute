import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import pb from "../../../services/pocketBaseClient"

interface DisputeData {
  page: number
  perPage: number
  totalItems: number
  totalPages: number
  items: DisputeRecord[]
}

interface Channel {
  id: string;
  name: string;
}

export interface DisputeRecord {
  id: string;
  tr_type: string;
  complain_date: string;
  doc_no: string;
  issue_by: string;
  acquirer_bank: string;
  location?: string;
  amount: string;
  RRNSTAN: string;
  phoenix_status: string;
  DMSRaiseDate: string;
  DMS_ID: string;
  resolve: string;
  persial: string;
  channel: string;
  remarks: string;
  issue_email: string; //hidden
  resolve_by: string; //hidden
  status: "issued" | "raised" | "accepted" | "resolved" | "rejected";
  customer: string;
  tran: string[];
  collectionId: string;
  note: string;
  EJ: string[];
  supporting_doc: string[];
}

// Define the order of columns to display
const DISPLAY_COLUMNS = [

  'id',
  'tr_type',
  'complain_date',
  'doc_no',
  'issue_by',
  'status',
  'acquirer_bank',
  'location',
  'amount',
  'RRNSTAN',
  'phoenix_status',
  'DMSRaiseDate',
  'resolve',
  'persial',
  'channel',
  'remarks',
  'note'
];

function PendingDispute() {
  const navigate = useNavigate()
  const [disputeData, setDisputeData] = useState<DisputeData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [channels, setChannels] = useState<Record<string, Channel>>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let ignore = false

    const fetchData = async () => {
      try {
        if (!pb.authStore.isValid) {
          navigate("/login")
          return
        }

        const resultList: any = await pb.collection("disputes").getList(1, 50, {
          filter: 'status = "issued"'
        });
        const channelsResponse = await pb.collection("channel").getList(1, 999);
        const channelsMap: Record<string, Channel> = {};

        channelsResponse.items.forEach((item: any) => {
          channelsMap[item.id] = item;
        });

        if (!ignore) {
          setDisputeData(resultList);
          setChannels(channelsMap);
        }
      } catch (err: any) {
        if (!ignore) {
          console.error("Failed to fetch dispute data:", err)
          setError(err.message || "Failed to load dispute data")
        }
      }
    }

    fetchData()

    return () => {
      ignore = true
    }
  }, [navigate])


  // New function to update dispute status
  const handleStatusUpdate = async (id: string, newStatus: "accepted" | "rejected") => {
    try {
      setLoading(true);
      await pb.collection("disputes").update(id, {
        status: newStatus,
        accept_by: pb.authStore.record?.id,
        accept_date: new Date().toISOString(),
        resolve_date: newStatus === "rejected" ? new Date().toISOString() : null,
        resolve_by: newStatus === "rejected" ? pb.authStore.record?.id : null

      });

      // After successful update, refresh the data with the same filter
      const resultList: any = await pb.collection("disputes").getList(1, 50, {
        filter: 'status = "issued"'
      });
      setDisputeData(resultList);
    } catch (err: any) {
      console.error("Failed to update status:", err);
      setError(err.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="alert alert-error">{error}</div>
  }

  if (!disputeData || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-2 pb-10 max-w-[98vw]">
      {/* Header - make it sticky */}
      <div className="flex justify-between items-center mb-2 sticky top-0 z-10 bg-base-100/80 backdrop-blur py-1">
        <h1 className="text-xl font-bold">Pending Disputes ({disputeData.totalItems})</h1>
        <button className="btn btn-primary btn-sm" onClick={() => navigate("/dispute")}>Disputes</button>
      </div>

      {/* Content */}
      {disputeData.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-4 text-center bg-base-200 rounded-lg">
          <div className="text-lg mb-2">No pending disputes found</div>
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/dispute/new")}>
            Create your first dispute
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-xs table-zebra w-full">
            <thead>
              <tr>
                <th>Actions</th>
                <th>RRN/STAN</th>
                <th>Type</th>
                <th>Date</th>
                <th>Doc No</th>
                <th>Issued By</th>
                <th>Bank</th>
                <th>Amount</th>
                <th>Channel</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {disputeData.items.map((item) => (
                <tr key={item.id} className="hover">
                  <td className="whitespace-nowrap">
                    <div className="flex gap-1">
                      <button
                        className="btn btn-xs btn-outline"
                        onClick={() => navigate(`/dispute/info/${item.id}`, { state: { disputeRecord: item } })}
                      >
                        Details
                      </button>
                      {item.status === "issued" && (
                        <>
                          <button
                            className="btn btn-xs btn-success"
                            onClick={() => handleStatusUpdate(item.id, "accepted")}
                          >
                            Accept
                          </button>
                          <button
                            className="btn btn-xs btn-error"
                            onClick={() => handleStatusUpdate(item.id, "rejected")}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="font-mono text-xs">{item.RRNSTAN || "-"}</td>
                  <td>{item.tr_type || "-"}</td>
                  <td>{item.complain_date || "-"}</td>
                  <td>{item.doc_no || "-"}</td>
                  <td>{item.issue_by || "-"}</td>
                  <td>{item.acquirer_bank || "-"}</td>
                  <td className="text-right font-mono">{item.amount ? parseFloat(item.amount).toLocaleString('en-BD') : "-"}</td>
                  <td>{channels[item.channel]?.name || "-"}</td>
                  <td><span className="badge badge-outline">{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default PendingDispute
