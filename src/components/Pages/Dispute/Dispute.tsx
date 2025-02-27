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
  status: ["issued", "raised", "accept", "resolved", "rejected"]
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

function Dispute() {
  const navigate = useNavigate()
  const [disputeData, setDisputeData] = useState<DisputeData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [channels, setChannels] = useState<Record<string, Channel>>({});

  useEffect(() => {
    let ignore = false

    const fetchData = async () => {
      try {
        if (!pb.authStore.isValid) {
          navigate("/login")
          return
        }

        const resultList: any = await pb.collection("disputes").getList(1, 50);
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

  // Get table headers in the specified order
  const getOrderedHeaders = () => {
    if (!disputeData?.items?.length) return [];

    // Filter out hidden fields and fields not in the first record
    return DISPLAY_COLUMNS.filter(
      column =>
        !['issue_email', 'resolve_by', 'collectionId', 'tran'].includes(column) &&
        column in (disputeData.items[0] || {})
    );
  };

  if (error) {
    return <div className="alert alert-error">{error}</div>
  }

  if (!disputeData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  const headers = getOrderedHeaders();

  // Modify the rendering of cells to handle special cases like channel
  const renderCellContent = (item: any, header: string) => {
    // Special handling for fields that should show full text
    if (['note', 'remarks', 'location'].includes(header)) {
      return (
        <div className="max-w-xs whitespace-normal text-xs">
          {item[header] || "-"}
        </div>
      );
    }

    if (header === 'channel' && channels[item[header]]) {
      return channels[item[header]].name;
    }

    if (header === 'amount' && item[header]) {
      // Format amount with commas and currency
      return <div className="text-right font-mono">{`${parseFloat(item[header]).toLocaleString('en-BD')}`}</div>;
    }

    // For normal fields, we'll use more compact rendering
    return item[header] === true
      ? "Yes"
      : item[header] === false
        ? "No"
        : item[header] || "-";
  };

  return (
    <div className="container mx-auto p-2 pb-20 max-w-[95vw]">
      {/* Header - make it sticky */}
      <div className="flex justify-between items-center mb-2 sticky top-0 z-10 bg-base-100/80 backdrop-blur py-2">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">Dispute Details</h1>
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => navigate("/dispute/new")}
        >
          Add Dispute
        </button>
      </div>

      {/* Content */}
      {disputeData.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-base-200 rounded-lg">
          <div className="text-xl mb-4">No disputes found</div>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/dispute/new")}
          >
            Create your first dispute
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table table-xs table-pin-rows table-zebra w-full">
              <thead className="sticky  bg-base-100  text-xs">
                <tr>
                  <th className="w-20">Actions</th>
                  {headers.map((header) => (
                    <th
                      key={header}
                      className={`capitalize ${['note', 'remarks', 'location'].includes(header) ? 'min-w-[200px]' : ''}`}
                    >
                      {header.replace(/_/g, " ")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-xs">
                {disputeData.items.map((item) => (
                  <tr key={item.id} className="hover">
                    <td>
                      <button
                        className="btn btn-xs btn-outline "
                        onClick={() => navigate(`/dispute/info/${item.id}`, { state: { disputeRecord: item } })}
                      >
                        Details
                      </button>
                    </td>
                    {headers.map((header) => (
                      <td key={`${item.id}-${header}`} className={`${['id', 'RRNSTAN'].includes(header) ? 'font-mono text-xs' : ''}`}>
                        {renderCellContent(item, header)}
                      </td>
                    ))}

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 pb-4 text-xs">Total Items: {disputeData.totalItems}</div>
        </>
      )}
    </div>
  )
}

export default Dispute
