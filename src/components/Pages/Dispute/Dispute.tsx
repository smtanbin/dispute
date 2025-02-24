import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import pb from "../../../services/pocketBaseClient";

interface DisputeData {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: Record<string, any>[];
}

function Dispute() {
  const navigate = useNavigate();
  const [disputeData, setDisputeData] = useState<DisputeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        if (!pb.authStore.isValid) {
          navigate("/login");
          return;
        }

        const resultList = await pb.collection('dispute').getList(1, 50,);
        console.log(resultList)
        if (!ignore) {
          setDisputeData(resultList);
        }
      } catch (err: any) {
        if (!ignore) {
          console.error("Failed to fetch dispute data:", err);
          setError(err.message || "Failed to load dispute data");
        }
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [navigate]);

  // Get table headers from the first item if data exists
  const getHeaders = () => {
    if (!disputeData?.items?.[0]) return [];
    return Object.keys(disputeData.items[0]).filter(key =>
      // Exclude internal fields if needed
      !['collectionId', 'collectionName'].includes(key)
    );
  };

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (!disputeData) {
    return <div className="flex justify-center items-center h-screen">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  const headers = getHeaders();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dispute Details</h1>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/dispute/new')}
        >
          Add Dispute
        </button>
      </div>

      {disputeData.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-base-200 rounded-lg">
          <div className="text-xl mb-4">No disputes found</div>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/dispute/new')}
          >
            Create your first dispute
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  {headers.map(header => (
                    <th key={header} className="capitalize">
                      {header.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {disputeData.items.map((item) => (
                  <tr key={item.id}>
                    {headers.map(header => (
                      <td key={`${item.id}-${header}`}>
                        {item[header] === true ? "Yes" :
                          item[header] === false ? "No" :
                            item[header] || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            Total Items: {disputeData.totalItems}
          </div>
        </>
      )}
    </div>
  );
}

export default Dispute;
