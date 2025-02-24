import { useState } from "react";
import { useNavigate } from "react-router";
import pb from "../../../services/pocketBaseClient";

interface DisputeFormData {
  PAN: string;
  account_no: string;
  title: string;
  doc_no: string;
  merchant: string;
  location: string;
  acquirer: string;
  amount: string;
  tr_amount: string;
  transaction_date: string;
  complain_date: string;
  terminalid: string;
  RRNSTAN: string;
  phoenix_status: string;
  DMSRaiseDate: string;
  channel: string;
  resolve: boolean;
  resolve_by: string;
  psl: boolean;
  status: string;
  remarks: string;
}

function AddDispute() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data: Partial<DisputeFormData> = {
      PAN: formData.get('PAN') as string,
      account_no: formData.get('account_no') as string,
      title: formData.get('title') as string,
      doc_no: formData.get('doc_no') as string,
      merchant: formData.get('merchant') as string,
      location: formData.get('location') as string,
      acquirer: formData.get('acquirer') as string,
      amount: formData.get('amount') as string,
      tr_amount: formData.get('tr_amount') as string,
      transaction_date: formData.get('transaction_date') as string,
      complain_date: formData.get('complain_date') as string,
      terminalid: formData.get('terminalid') as string,
      RRNSTAN: formData.get('RRNSTAN') as string,
      phoenix_status: formData.get('phoenix_status') as string,
      DMSRaiseDate: formData.get('DMSRaiseDate') as string,
      channel: formData.get('channel') as string,
      resolve: false, // Default value
      resolve_by: formData.get('resolve_by') as string,
      psl: formData.get('psl') === 'true',
      status: 'issued', // Default value
      remarks: formData.get('remarks') as string,
    };

    try {
      await pb.collection('dispute').create(data);
      navigate('/dispute');
    } catch (err: any) {
      console.error('Failed to create dispute:', err);
      setError(err.message || 'Failed to create dispute');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Add New Dispute</h1>
        <button
          className="btn btn-ghost"
          onClick={() => navigate('/dispute')}
        >
          Back
        </button>
      </div>

      {error && (
        <div className="alert alert-error mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label"><span className="label-text">PAN</span></label>
            <input type="text" name="PAN" required className="input input-bordered" />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">Account Number</span></label>
            <input type="text" name="account_no" required className="input input-bordered" />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">Title</span></label>
            <input type="text" name="title" required className="input input-bordered" />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">Document Number</span></label>
            <input type="text" name="doc_no" required className="input input-bordered" />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">Merchant</span></label>
            <input type="text" name="merchant" required className="input input-bordered" />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">Location</span></label>
            <input type="text" name="location" required className="input input-bordered" />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">Acquirer</span></label>
            <input type="text" name="acquirer" required className="input input-bordered" />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">Amount</span></label>
            <input type="text" name="amount" required className="input input-bordered" />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">Transaction Amount</span></label>
            <input type="text" name="tr_amount" required className="input input-bordered" />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">Transaction Date</span></label>
            <input type="datetime-local" name="transaction_date" required className="input input-bordered" />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">Complain Date</span></label>
            <input type="datetime-local" name="complain_date" required className="input input-bordered" />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">Terminal ID</span></label>
            <input type="text" name="terminalid" required className="input input-bordered" />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">RRNSTAN</span></label>
            <input type="text" name="RRNSTAN" required className="input input-bordered" />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">Phoenix Status</span></label>
            <input type="text" name="phoenix_status" required className="input input-bordered" />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">DMS Raise Date</span></label>
            <input type="datetime-local" name="DMSRaiseDate" required className="input input-bordered" />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">Channel</span></label>
            <input type="text" name="channel" required className="input input-bordered" />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">Resolve By</span></label>
            <input type="text" name="resolve_by" required className="input input-bordered" />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">PSL</span></label>
            <select name="psl" className="select select-bordered">
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>

        <div className="form-control">
          <label className="label"><span className="label-text">Remarks</span></label>
          <textarea name="remarks" className="textarea textarea-bordered h-24" required></textarea>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => navigate('/dispute')}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? <span className="loading loading-spinner"></span> : 'Create Dispute'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddDispute;
