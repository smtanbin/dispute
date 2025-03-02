import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import pb from "../../../../services/pocketBaseClient";
import Background from "../../../Background/Background";
import DocumentInfo, { DocumentInfoItem } from "./DocumentInfo";

interface DocumentInfoResponse {
  error?: string;
  payload: DocumentInfoItem[];
  stream: any[];
}

interface Channel {
  id: string;
  name: string;
}

interface Bank {
  id: string;
  name: string;
}

function PublicDispute() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [channelsLoading, setChannelsLoading] = useState(false);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [banksLoading, setBanksLoading] = useState(false);
  const [docno, setDocNo] = useState<string>("");
  const [data, setData] = useState<DocumentInfoItem[]>([]);
  const [accountData, setAccountData] = useState<any[]>([]);
  const [transactionIds, setTransactionIds] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTrIds, setShowTrIds] = useState(false);
  const [isPartial, setIsPartial] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [disputeId, setDisputeId] = useState<string>("");

  const channelsAbortController = useRef<AbortController | null>(null);
  const banksAbortController = useRef<AbortController | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handlePrintReport = useCallback(() => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setError("Popup blocked. Please allow popups for this site to print the report.");
      setShowErrorModal(true);
      return;
    }

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Dispute Report - ${docno}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.4; font-size: 12px; }
        .header { text-align: center; margin-bottom: 15px; }
        .header h1 { color: #1e3a8a; margin: 0 0 5px 0; font-size: 18px; }
        .header p { margin: 2px 0; }
        .info-section { margin-bottom: 15px; }
        .info-section h2 { color: #1e3a8a; font-size: 14px; border-bottom: 1px solid #ddd; padding-bottom: 3px; margin: 10px 0 5px 0; }
        .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); grid-gap: 5px; }
        .info-item { display: flex; }
        .info-label { font-weight: bold; width: 100px; flex-shrink: 0; }
        .info-value { flex: 1; }
        .transaction-table { width: 100%; border-collapse: collapse; font-size: 11px; }
        .transaction-table th { background-color: #f3f4f6; text-align: left; padding: 4px; }
        .transaction-table td { border: 1px solid #ddd; padding: 4px; }
        .transaction-table tr:nth-child(even) { background-color: #f9fafb; }
        .footer { margin-top: 20px; text-align: center; font-size: 10px; color: #6b7280; }
        @media print {
          body { margin: 10px; }
          .no-print { display: none; }
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Dispute Report</h1>
        <p>Document Number: ${docno} | Date: ${new Date().toLocaleDateString()}</p>
        <h3>Tracking No: ${disputeId || 'Not assigned'}</h3>
      </div>
      
      
      <div class="info-section">
        <h2>Customer Information</h2>
        ${accountData.length > 0 ? `
          <div class="info-grid">
            <div class="info-item"><div class="info-label">Name:</div><div class="info-value">${accountData[0].TITLE || 'N/A'}</div></div>
            <div class="info-item"><div class="info-label">Account:</div><div class="info-value">${data[0]?.ACCOUNT || 'N/A'}</div></div>
            <div class="info-item"><div class="info-label">Branch:</div><div class="info-value">${accountData[0].BRANCHCODE || 'N/A'}</div></div>
            <div class="info-item"><div class="info-label">Phone:</div><div class="info-value">${accountData[0].MSISDN || 'N/A'}</div></div>
            <div class="info-item"><div class="info-label">Email:</div><div class="info-value">${accountData[0].EMAIL || 'N/A'}</div></div>
          </div>
        ` : '<p>No customer data available</p>'}
      </div>
      
      <div class="info-section">
        <h2>Dispute Details</h2>
        <div class="info-grid">
          <div class="info-item"><div class="info-label">Status:</div><div class="info-value">Issued</div></div>
          <div class="info-item"><div class="info-label">Amount:</div><div class="info-value">${reportData?.amount ? '৳ ' + reportData.amount : 'N/A'}</div></div>
          <div class="info-item"><div class="info-label">Partial:</div><div class="info-value">${reportData?.partial ? 'Yes' : 'No'}</div></div>
          <div class="info-item"><div class="info-label">Location:</div><div class="info-value">${reportData?.location || 'N/A'}</div></div>
          <div class="info-item"><div class="info-label">Acquirer:</div><div class="info-value">${reportData?.acquirer || 'N/A'}</div></div>
          <div class="info-item"><div class="info-label">Issued By:</div><div class="info-value">${reportData?.issueBranch || 'N/A'}</div></div>
          <div class="info-item"><div class="info-label">Email:</div><div class="info-value">${reportData?.issueEmail || 'N/A'}</div></div>
        </div>
        <div class="info-item" style="margin-top:5px"><div class="info-label">Notes:</div><div class="info-value">${reportData?.notes || 'N/A'}</div></div>
      </div>
      
      <div class="info-section">
        <h2>Transactions</h2>
        ${data.length > 0 ? `
          <table class="transaction-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Amount</th>
                <th>Terminal</th>
                <th>Status</th>
                <th>Trace #</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              ${data.map((item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.AMOUNT || 'N/A'}</td>
                  <td>${item.TERMINAL_NAME || 'N/A'}</td>
                  <td>${item.STATUS || 'N/A'}</td>
                  <td>${item.TRACENUM || 'N/A'}</td>
                  <td>${item.TIMESTAMP ? new Date(item.TIMESTAMP).toLocaleString() : 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : '<p>No transaction data available</p>'}
      </div>
      
      <div class="footer">
        <p>© ${new Date().getFullYear()} Standard Bank PLC. DMS | Generated: ${new Date().toLocaleString()}</p>
      </div>
      
      <div class="no-print" style="text-align: center; margin-top: 15px;">
        <button onclick="window.print();" style="padding: 8px 15px; background:#6b7280; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Print Report</button>
        <button onclick="window.close();" style="padding: 8px 15px; background:hsl(0, 100.00%, 69.80%); color: white; border: none; border-radius: 4px; margin-left: 10px; cursor: pointer; font-size: 12px;">Close</button>
      </div>
    </body>
    </html>
  `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }, [docno, data, accountData, reportData, disputeId])

  const fetchDocNumber = async () => {
    setLoading(true);
    setError(null);
    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer 0cf0758141da135777fc936983f910f7df7c934c2ac7aaedda2dc78fd1febc422d09c7509471927573f67b5bc5f5c45a4a4da202618564c8df4b6f1cdf879be6`);
      myHeaders.append("Content-Type", "application/json");

      const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({}),
        redirect: "follow",
      };

      const response = await fetch('/frogi/dispute/pos_atm_search?docnum=' + docno, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData: DocumentInfoResponse = await response.json();

      if (responseData.error) {
        setError(responseData.error);
        setShowErrorModal(true);
      } else {
        setAccountData(responseData.payload);
        setData(responseData.stream);
      }
    } catch (e: any) {
      setError(e.message || "An error occurred");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchChannels = useCallback(async () => {
    setChannelsLoading(true);

    if (channelsAbortController.current) {
      channelsAbortController.current.abort();
    }

    channelsAbortController.current = new AbortController();

    try {
      const response = await pb.collection('channel').getList(1, 100, {
        sort: 'name',
      });

      setChannels(response.items.map(item => ({
        id: item.id,
        name: item.name,
      })));
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Failed to fetch channels:', err);
      }
    } finally {
      setChannelsLoading(false);
    }
  }, []);

  const fetchBanks = useCallback(async () => {
    setBanksLoading(true);

    if (banksAbortController.current) {
      banksAbortController.current.abort();
    }

    banksAbortController.current = new AbortController();

    try {
      const response = await pb.collection('bank_list').getList(1, 100, {
        sort: 'name',
        signal: banksAbortController.current.signal
      });
      setBanks(response.items.map(item => ({
        id: item.id,
        name: item.name,
      })));
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Failed to fetch banks:', err);
      }
    } finally {
      setBanksLoading(false);
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.length || !accountData.length) {
      setError("Please search for a document first");
      setShowErrorModal(true);
      return;
    }

    setIsGenerating(true);
    setError(null);

    // Arrays to store created records for potential rollback
    const createdTransactionIds: string[] = [];
    let createdCustomerId: string | null = null;

    try {
      // Step 1: Store transaction records and collect IDs
      try {
        for (const item of data) {
          const transactionData = {
            account: item.ACCOUNT,
            acu_branch: item.ACCURED,
            product: item.ACTYPE,
            serial: item.SERNUM,
            amount: item.AMOUNT,
            branch: item.BRANCD,
            charges: item.CHARGES,
            cr_code: item.CRCODE,
            credit: item.CREDIT,
            dr_code: item.DRCODE,
            debit: item.DEBIT,
            debit_credit: item.DEBCRE,
            docnum: item.DOCNUM,
            doctype: item.DOCTYP,
            status: item.STATUS,
            pan: item.PAN,
            remark: item.REMARK,
            terminal_id: item.TERMINAL_ID,
            terminal_name: item.TERMINAL_NAME,
            tracenum: item.TRACENUM,
            trchqnum: item.TRCHQNUM,
            timestamp: item.TIMESTAMP ? new Date(item.TIMESTAMP).toISOString() : new Date().toISOString(),
            rev_timestamp: item.REVDATE ? new Date(item.REVDATE).toISOString() : null
          };
          // Log the transaction data for debugging

          pb.collection('dispute_tr').create(transactionData).then((res: any) => createdTransactionIds.push(res.id))
            .catch((err: any) => {
              console.error("Stasge 1:", err);
            }
            );
        }
      } catch (err: any) {
        throw new Error(`Failed to create transaction records: ${err.message}`);
      }

      // Step 2: Store customer record
      try {
        const customerData = {
          "cfid": accountData[0].CFID,
          "account": data[0].ACCOUNT,
          "branch_code": accountData[0].BRANCHCODE,
          "name": accountData[0].TITLE,
          "phone": accountData[0].MSISDN,
          "email": accountData[0].EMAIL,
          "address": accountData[0].ADDRESS,
        };
        const customerRecord = await pb.collection('dispute_client').create(customerData);
        createdCustomerId = customerRecord.id;
      } catch (err: any) {
        throw new Error(`Failed to create customer record: ${err.message}`);
      }

      // Step 3: Get form values and validate
      if (!formRef.current) {
        throw new Error("Form reference is not available");
      }

      const formData = new FormData(formRef.current);
      const location = formData.get('location') as string;
      const amount = formData.get('amount') as string;
      const acquirer = formData.get('acquirer') as string;
      const channel = formData.get('channel') as string;
      const issueBranch = formData.get('branch') as string;
      const issueEmail = formData.get('iemail') as string;
      const notes = formData.get('remarks') as string;

      // Validate required fields
      if (!location || !amount || !acquirer || !channel || !issueBranch || !issueEmail) {
        throw new Error("Please fill in all required fields");
      }

      // Save form data for report
      setReportData({
        amount: parseFloat(amount) || 0,
        location,
        acquirer,
        channel,
        issueBranch,
        issueEmail,
        notes,
        partial: isPartial
      });

      // Step 4: Create dispute record with relations
      let disputeRecord;
      try {
        const disputeData = {
          "complain_date": new Date().toISOString(),
          "location": location,
          "amount": parseFloat(amount) || 0,
          "acquirer_bank": acquirer,
          "doc_no": docno,
          "partial": isPartial,
          "channel": channel,
          "issue_by": issueBranch,
          "issue_email": issueEmail,
          "status": "issued",
          "tr_type": data[0].DOCTYP ? data[0].DOCTYP : data[1].DOCTYP,
          "customer": createdCustomerId,
          "tran": createdTransactionIds,
          "note": notes
        };

        disputeRecord = await pb.collection('disputes').create(disputeData);
        // Set the dispute ID for the report
        setDisputeId(disputeRecord.id);
      } catch (err: any) {
        throw new Error(`Failed to create dispute record: ${err.message}`);
      }

      // Success - show message with transaction IDs
      setTransactionIds(createdTransactionIds);
      setShowTrIds(true);
      setSuccessMessage(`Successfully created dispute for document: ${docno}`);

      // Reset form after successful submission
      formRef.current?.reset();

      return disputeRecord;
    } catch (err: any) {
      console.error('Failed to store dispute details:', err);
      setError(err.message || "An error occurred while saving the dispute");
      setShowErrorModal(true);

      // Rollback: Delete created records if any step fails
      try {
        // Rollback transactions
        if (createdTransactionIds.length > 0) {
          await Promise.allSettled(
            createdTransactionIds.map(id =>
              pb.collection('dispute_tr').delete(id)
                .catch(e => console.error(`Failed to delete transaction ${id}:`, e))
            )
          );
        }

        // Rollback customer record
        if (createdCustomerId) {
          await pb.collection('dispute_client').delete(createdCustomerId)
            .catch(e => console.error(`Failed to delete customer ${createdCustomerId}:`, e));
        }

        console.log('Rollback completed after error');
      } catch (rollbackErr) {
        console.error('Error during rollback:', rollbackErr);
        setError((prev) => `${prev}. Additionally, cleanup failed.`);
      }

      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    fetchChannels();
    fetchBanks();

    // Clean up abort controllers on unmount
    return () => {
      channelsAbortController.current?.abort();
      banksAbortController.current?.abort();
    };
  }, [fetchChannels, fetchBanks]);

  return (
    <Background>
      <div className="container mx-auto p-4 min-h-screen">
        <div className="flex justify-between items-center mb-6 sticky top-0 z-10 py-3 bg-base-100/80 backdrop-blur-lg rounded-lg px-4 shadow-sm">
          <button
            className="btn btn-ghost btn-sm hover:bg-primary/10 transition-all"
            onClick={() => navigate('/dispute')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>

          <h1 className="text-2xl text-primary font-bold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Add New Dispute
          </h1>
        </div>

        {error && (
          <div className="alert alert-error mb-6 shadow-md animate-fadeIn">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Document Timeline on the left */}
          <div className="md:w-2/5 w-full">
            <div className="card shadow-lg bg-base-100/50 backdrop-blur-lg hover:shadow-xl transition-all duration-300">
              <div className="card-body p-5">
                <h2 className="text-lg font-semibold flex items-center text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Document Search
                </h2>
                <div className="form-control mt-3 w-full">
                  <div className="join w-full shadow-sm hover:shadow transition-all">
                    <input
                      type="text"
                      className="input input-bordered join-item w-full focus:outline-primary focus:border-primary"
                      value={docno}
                      onChange={(e) => setDocNo(e.target.value)}
                      placeholder="Enter document number..."
                    />
                    <button
                      className="btn join-item bg-primary hover:bg-primary-focus text-white"
                      onClick={(e) => {
                        e.preventDefault();
                        fetchDocNumber();
                      }}
                      disabled={loading}
                    >

                      {loading ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      )}
                      {loading ? "Searching..." : "Search"}
                    </button>

                  </div>

                </div>
                <button className="text-primary btn" onClick={() => navigate("/disputeStatement")}>
                  Check Transactions</button>
                <div className="divider my-3"></div>

                {/* Document Timeline content */}
                <div className="overflow-auto max-h-[calc(100vh-280px)] custom-scrollbar">
                  <DocumentInfo data={data} isLoading={loading} />
                </div>
              </div>
            </div>
          </div>

          {/* Form on the right */}
          <div className="md:w-3/5 w-full">
            <form ref={formRef} className="space-y-4" onSubmit={handleSave}>
              <div className="card shadow-lg bg-base-100/50 backdrop-blur-lg hover:shadow-xl transition-all duration-300">
                <div className="card-body p-6">
                  <h2 className="text-lg font-semibold flex items-center text-primary mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Save
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Form fields */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Location</span>
                      </label>
                      <input
                        type="text"
                        name="location"
                        required
                        className="input input-bordered focus:outline-primary"
                        placeholder="Enter location"
                      />
                    </div>

                    {/* Bank selection */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Acquirer Bank</span>
                      </label>
                      {banksLoading ? (
                        <div className="flex items-center space-x-2 p-2 border rounded-lg border-base-300 bg-base-200/50">
                          <span className="loading loading-spinner loading-xs"></span>
                          <span>Loading banks...</span>
                        </div>
                      ) : (
                        <select
                          name="acquirer"
                          required
                          className="select select-bordered focus:outline-primary"
                          defaultValue=""
                        >
                          <option value="" disabled>Select acquirer bank</option>
                          {banks.map(bank => (
                            <option key={bank.id} value={bank.name}>
                              {bank.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {/* Channel selection */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Channel</span>
                      </label>
                      {channelsLoading ? (
                        <div className="flex items-center space-x-2 p-2 border rounded-lg border-base-300 bg-base-200/50">
                          <span className="loading loading-spinner loading-xs"></span>
                          <span>Loading channels...</span>
                        </div>
                      ) : (
                        <select
                          name="channel"
                          required
                          className="select select-bordered focus:outline-primary"
                          defaultValue=""
                        >
                          <option value="" disabled>Select channel</option>
                          {channels.map(channel => (
                            <option key={channel.id} value={channel.id}>
                              {channel.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {/* More form fields */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Issue Branch</span>
                      </label>
                      <input
                        type="text"
                        name="branch"
                        required
                        className="input input-bordered focus:outline-primary"
                        placeholder="Enter branch name"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Issuer Email</span>
                      </label>
                      <input
                        type="email"
                        name="iemail"
                        required
                        className="input input-bordered focus:outline-primary"
                        placeholder="Enter email address"
                      />
                    </div>

                    {/* Dispute amount section */}
                    <div className="form-control col-span-2">
                      <label className="label">
                        <span className="label-text font-medium">Dispute Amount</span>
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">৳</span>
                            <input
                              type="text"
                              name="amount"
                              required
                              className="input input-bordered w-full pl-7 focus:outline-primary"
                              placeholder="Enter amount"
                            />
                          </div>
                        </div>
                        <div className="flex items-center">
                          <label className="cursor-pointer label justify-start gap-3">
                            <input
                              type="checkbox"
                              checked={isPartial}
                              onChange={(e) => setIsPartial(e.target.checked)}
                              className="toggle toggle-primary"
                            />
                            <span className="label-text">Partial Amount</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes field */}
                  <div className="form-control mt-5">
                    <label className="label">
                      <span className="label-text font-medium">Dispute Notes</span>
                    </label>
                    <textarea
                      name="remarks"
                      className="textarea textarea-bordered h-28 focus:outline-primary"

                      placeholder="Enter dispute details and notes here..."
                    ></textarea>
                  </div>

                  {/* Form buttons */}
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => navigate('/dispute')}
                      disabled={isGenerating}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading || isGenerating || !data.length}
                    >
                      {(loading || isGenerating) ? (
                        <span className="loading loading-spinner loading-sm mr-2"></span>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {(loading || isGenerating) ? 'Creating...' : 'Create Dispute'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      {
        showErrorModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
            <div className="modal-box relative bg-base-100 shadow-lg rounded-lg max-w-md w-full">
              <div className="p-6">
                <h3 className="font-bold text-lg flex items-center text-error">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Error
                </h3>
                <div className="py-4">
                  <p>{error}</p>
                </div>
                <div className="modal-action">
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowErrorModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Success Modal with Print */}
      {
        showTrIds && transactionIds.length > 0 && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
            <div className="modal-box relative bg-base-100 shadow-lg rounded-lg max-w-xl w-full">
              <div className="p-6">
                <h3 className="font-bold text-lg flex items-center text-success">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Success
                </h3>
                <div className="py-4">
                  <p className="text-md  mb-3">{successMessage}</p>
                  <h1 className="text-lg font-medium mb-3">Tracking No:
                    #{disputeId.toUpperCase()}</h1>

                </div>
                <div className="modal-action flex justify-between">
                  <button
                    className="btn btn-outline btn-success"
                    onClick={handlePrintReport}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print Report
                  </button>
                  <button
                    className="btn"
                    onClick={() => {
                      setShowTrIds(false);
                      navigate('/dispute');
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

    </Background >
  );
}

export default PublicDispute;