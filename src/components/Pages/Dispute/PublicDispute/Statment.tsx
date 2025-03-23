import { useState } from 'react';
import { useNavigate } from 'react-router';
import Background from '../../../Background/Background';

// Helper function to format date from DD/MM/YYYY to YYYY-MM-DD for API
function formatDDMMYYYY(dateString: string) {
  if (!dateString || !dateString.includes('/')) return '';
  const [dd, mm, yyyy] = dateString.split("/");
  return `${dd}/${mm}/${yyyy}`;
}

// Helper function to validate DD/MM/YYYY format
function isValidDDMMYYYY(dateStr: string) {
  const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  return regex.test(dateStr);
}


interface StatementRecord {
  [x: string]: any;
  BALANCE: number;
  CREDIT: number | null;
  DEBIT: number | null;
  REMARK: string;
  TIMESTAMP: string | null;
  TRANSACTION?: string;
}
const myHeaders = new Headers();
myHeaders.append("Authorization", `Bearer 0cf0758141da135777fc936983f910f7df7c934c2ac7aaedda2dc78fd1febc422d09c7509471927573f67b5bc5f5c45a4a4da202618564c8df4b6f1cdf879be6`);
myHeaders.append("Content-Type", "application/json");
const requestOptions = {
  method: "GET",
  headers: myHeaders,

};

export default function PublicDisputeStatement() {
  const navigate = useNavigate();
  const [account, setAccount] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [productType, setProductType] = useState("");
  const [statementRows, setStatementRows] = useState<StatementRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to convert YYYY-MM-DD to DD/MM/YYYY
  const handleDateChange = (date: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    if (date) {
      const [year, month, day] = date.split('-');
      setter(`${day}/${month}/${year}`);
    } else {
      setter("");
    }
  };

  // Function to convert DD/MM/YYYY to YYYY-MM-DD for the date input
  const formatForDateInput = (dateStr: string) => {
    if (!dateStr || !dateStr.includes('/')) return '';
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  };

  const handleSearch = async () => {
    if (!isValidDDMMYYYY(fromDate) || !isValidDDMMYYYY(toDate)) {
      setError("Please enter dates in DD/MM/YYYY format");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fromFormatted = formatDDMMYYYY(fromDate);
      const toFormatted = formatDDMMYYYY(toDate);
      const response = await fetch(
        `/frogi/customers/statement?account=${account}&from_date=${fromFormatted}&to_date=${toFormatted}&product_type_code=${productType.toUpperCase()}`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();

      if (json.error) {
        throw new Error(json.error);
      }

      setStatementRows(json.payload?.data || []);

      if (json.payload?.data?.length === 0) {
        setError("No records found for the given criteria");
      }
    } catch (err) {
      console.error("Failed to fetch statement:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch statement data");
      setStatementRows([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Background>
      <div className=' h-full'>
        <div className="flex flex-col h-full">
          {/* Back button */}
          <div className="flex flex-col lg:flex-row gap-4 h-full">
            {/* Sidebar with filters - fixed to the top */}
            <div className="lg:w-1/4 w-full">
              <div className="card bg-base-100/50 backdrop-blur-lg shadow p-4 sticky top-20 h-full overflow-y-auto">
                <div className="flex items-center mb-2">
                  <button
                    className="btn btn-ghost text-primary mx-0 my-2"
                    onClick={() => navigate('/disputeRegister')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back
                  </button>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Account</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter account number"
                    className="input input-bordered w-full input-sm"
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">From Date</span>
                    <span className="label-text-alt">DD/MM/YYYY</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered w-full input-sm"
                    value={formatForDateInput(fromDate)}
                    onChange={(e) => handleDateChange(e.target.value, setFromDate)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">To Date</span>
                    <span className="label-text-alt">DD/MM/YYYY</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered w-full input-sm"
                    value={formatForDateInput(toDate)}
                    onChange={(e) => handleDateChange(e.target.value, setToDate)}
                  />
                </div>

                <div className="form-control mb-6">
                  <label className="label">
                    <span className="label-text">Product Code</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter product code like S01"
                    className="input input-bordered w-full input-sm"
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                  />
                </div>

                {error && (
                  <div className="alert alert-error shadow-lg mb-4">
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                <button
                  className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
                  onClick={handleSearch}
                  disabled={isLoading || !account || !fromDate || !toDate || !productType}
                >
                  {!isLoading && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  )}
                  {isLoading ? 'Loading...' : 'Fetch Statement'}
                </button>
              </div>
            </div>

            {/* Main content area with results */}
            <div className="lg:w-3/4 w-full ">
              <div className="card bg-base-100/90  backdrop-blur-lg  shadow p-4">
                <h2 className="card-title mb-4">Statement Results</h2>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="loading loading-spinner loading-lg"></div>
                    <p className="mt-4 text-base-content/70">Fetching statement data...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                      <thead>
                        <tr>
                          <th>Timestamp</th>
                          <th>Doc Number</th>
                          <th className="text-right">Credit</th>
                          <th className="text-right">Debit</th>
                          <th>Remark</th>
                        </tr>
                      </thead>
                      <tbody>
                        {statementRows.length > 0 ? (
                          statementRows.map((row, idx) => (
                            <tr key={idx}>
                              <td>{row.TIMESTAMP || "N/A"}</td>
                              <td>{row.DOCTYPE}</td>
                              <td className="text-right text-success">{row.CREDIT ? `+${row.CREDIT.toFixed(2)}` : ''}</td>
                              <td className="text-right text-error">{row.DEBIT ? `-${row.DEBIT.toFixed(2)}` : ''}</td>
                              <td>{row.REMARK}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-center py-4">
                              {error ?
                                <span className="text-error">Error: {error}</span> :
                                "No data available. Please use the filters to fetch statement data."
                              }
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Background>
  );
}

