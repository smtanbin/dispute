import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router";
import pb from "../../../services/pocketBaseClient";
import { DisputeRecord } from "./Dispute";

export default function DisputeDetails() {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [disputeRecord, setDisputeRecord] = useState<DisputeRecord | null>(
    location.state?.disputeRecord || null
  );
  const [loading, setLoading] = useState<boolean>(!disputeRecord);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we don't have the dispute record from navigation state, fetch it
    if (!disputeRecord && id) {
      const fetchDisputeRecord = async () => {
        try {
          setLoading(true);
          const record = await pb.collection('disputes').getOne(id);
          setDisputeRecord(record as unknown as DisputeRecord);
        } catch (err: any) {
          console.error("Failed to fetch dispute details:", err);
          setError(err.message || "Failed to load dispute details");
        } finally {
          setLoading(false);
        }
      };

      fetchDisputeRecord();
    }
  }, [disputeRecord, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="alert alert-error">
          <div>
            <span>{error}</span>
          </div>
        </div>
        <button className="btn btn-primary mt-4" onClick={() => navigate('/dispute')}>
          Back to Disputes
        </button>
      </div>
    );
  }

  if (!disputeRecord) {
    return (
      <div className="container mx-auto p-4">
        <div className="alert alert-warning">
          <div>
            <span>Dispute record not found</span>
          </div>
        </div>
        <button className="btn btn-primary mt-4" onClick={() => navigate('/dispute')}>
          Back to Disputes
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dispute Details</h1>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => navigate('/dispute')}
        >
          Back to List
        </button>
      </div>

      <div className="bg-base-200 p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Basic Information</h2>
            <div className="space-y-3">
              <div className="flex flex-col">
                <span className="text-sm opacity-70">ID</span>
                <span className="font-mono">{disputeRecord.id}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm opacity-70">Transaction Type</span>
                <span>{disputeRecord.tr_type}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm opacity-70">Complain Date</span>
                <span>{disputeRecord.complain_date}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm opacity-70">Document Number</span>
                <span>{disputeRecord.doc_no}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm opacity-70">Issued By</span>
                <span>{disputeRecord.issue_by}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm opacity-70">Status</span>
                <span className="badge badge-primary">{disputeRecord.status}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm opacity-70">Amount</span>
                <span className="font-mono font-semibold">
                  {parseFloat(disputeRecord.amount).toLocaleString('en-BD')}
                </span>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Additional Details</h2>
            <div className="space-y-3">
              <div className="flex flex-col">
                <span className="text-sm opacity-70">Acquirer Bank</span>
                <span>{disputeRecord.acquirer_bank || "-"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm opacity-70">Location</span>
                <span>{disputeRecord.location || "-"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm opacity-70">RRN/STAN</span>
                <span className="font-mono">{disputeRecord.RRNSTAN || "-"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm opacity-70">Phoenix Status</span>
                <span>{disputeRecord.phoenix_status || "-"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm opacity-70">DMS Raise Date</span>
                <span>{disputeRecord.DMSRaiseDate || "-"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm opacity-70">Resolve</span>
                <span>{disputeRecord.resolve || "-"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm opacity-70">Persial</span>
                <span>{disputeRecord.persial || "-"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Full width sections for longer text */}
        <div className="mt-8 space-y-6">
          <div className="flex flex-col">
            <span className="text-sm opacity-70">Remarks</span>
            <div className="p-3 bg-base-300 rounded-md min-h-[60px]">
              {disputeRecord.remarks || "No remarks provided"}
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-sm opacity-70">Notes</span>
            <div className="p-3 bg-base-300 rounded-md min-h-[60px]">
              {disputeRecord.note || "No notes provided"}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-end space-x-2">
          <button className="btn btn-outline">Edit</button>
          <button className="btn btn-primary">Update Status</button>
        </div>
      </div>
    </div>
  );
}