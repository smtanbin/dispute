import { FC, memo, useEffect, useState } from "react";
import processPaymentType from "../../../../utils/processPaymentType";
import { ReactNode } from 'react';
import docType from "../../../../utils/docType";

export interface DocumentInfoItem {
  SERNUM: ReactNode;
  DEBCRE: string;
  ACCURED: string;
  DOCNUM: string;
  ACTYPE: string;
  TIMESTAMP: string;
  AMOUNT: number;
  TERMINAL_ID: string;
  TERMINAL_NAME: string;
  REMARK: string;
  TRACENUM?: string;
  ACCOUNT?: string;
  CREDIT?: number;
  DEBIT?: number;
  DRCODE?: number;
  CRCODE?: number;
  DOCTYP?: string;
  TRCHQNUM?: number;
  STATUS?: string;
  PAN?: string;
  REVDATE?: string;
  BRANCD?: string;
  CHARGES?: number;
}

interface DocumentInfoProps {
  data: DocumentInfoItem[];
  isLoading?: boolean; // New prop to indicate loading state
}

const DocumentInfo: FC<DocumentInfoProps> = memo(({ data, isLoading = false }) => {
  const [documentData, setDocumentData] = useState<DocumentInfoItem[]>([]);

  // Only update state when data changes to prevent multiple re-renders
  useEffect(() => {
    // Only update if data has meaningfully changed
    if (JSON.stringify(documentData) !== JSON.stringify(data)) {
      console.log("Document data updated:", data);
      setDocumentData(data);
    }
  }, [data]);

  // Show loading state when isLoading is true
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-pulse">
        <div className="bg-base-200 p-4 rounded-full mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-primary/90">Fetching Document Data</h3>
        <div className="mt-4">
          <span className="loading loading-dots loading-md text-primary"></span>
        </div>
        <p className="text-sm text-base-content/60 mt-3">This may take a moment, please wait...</p>
      </div>
    );
  }

  if (!documentData || documentData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="mt-2 text-gray-500">No document information found</p>
        <p className="text-sm text-gray-400">Search for a document to see its timeline</p>
      </div>
    );
  }

  return (
    <div className="my-0">
      <h2 className="text-lg font-semibold mb-3 text-primary">Transaction</h2>
      <div className="space-y-4">
        {documentData.map((item, index) => (
          <div
            key={index}
            className={`card shadow-md hover:shadow-lg transition-all duration-300 ${item.DEBCRE === 'D'
              ? 'border-l-4 border-error/70 bg-error/5'
              : 'border-l-4 border-success/70 bg-success/5'
              }`}
          >
            <div className="card-body p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="badge badge-primary font-medium">#{item.DOCNUM}</span>
                  <span className="badge badge-outline">{item.SERNUM}</span>
                </div>
                <span className={`badge ${item.DEBCRE === 'D' ? 'badge-error' : 'badge-success'} badge-sm font-medium`}>
                  {processPaymentType(item.DEBCRE)}
                </span>
              </div>

              <span className="flex justify-between">
                <h3 className="font-bold text-sm mt-1">
                  <span className="text-primary mr-2">{item.TIMESTAMP}</span>
                  {item.TERMINAL_NAME ? <span className="font-normal">at {item.TERMINAL_NAME}</span> : <></>}
                </h3>

                {item.DOCTYP && (
                  <div className="bg-primary-content/70 rounded-lg p-2 w-20 text-center">
                    <p className={`font-medium ${item.DOCTYP === 'R' ? 'text-error' : ''}`}>
                      {docType(item.DOCTYP || 'Unknown')}
                    </p>
                  </div>
                )}

              </span>
              <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                {/* Added ACCOUNT field */}
                {item.ACCOUNT && (
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="opacity-70">Account:</span>
                    <span className="ml-1 font-medium">
                      {item.ACCOUNT}
                    </span>
                  </div>
                )}

                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                  <span className="opacity-70">Terminal ID:</span>
                  <span className="ml-1 font-medium">{item.TERMINAL_ID}</span>
                </div>

                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="opacity-70">Amount:</span>
                  <span className="ml-1 font-medium"> {new Intl.NumberFormat('en-BD', {
                    style: 'currency',
                    currency: 'BDT',
                    minimumFractionDigits: 2
                  }).format(item.AMOUNT)}</span>
                </div>

                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="opacity-70">Charge:</span>
                  <span className="ml-1 font-medium"> {new Intl.NumberFormat('en-BD', {
                    style: 'currency',
                    currency: 'BDT',
                    minimumFractionDigits: 2
                  }).format(item.CHARGES || 0)}</span>
                </div>

                {/* Added TRACENUM field */}
                {item.DEBCRE && item.DEBCRE === 'D' ? (
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="opacity-70">Debit:</span>
                    <span className="ml-1 font-medium">{item.DEBIT}</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="opacity-70">Credit:</span>
                    <span className="ml-1 font-medium">{item.CREDIT}</span>
                  </div>
                )}


                {/* Added TRACENUM field */}
                {item.TRACENUM && (
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="opacity-70">Trace:</span>
                    <span className="ml-1 font-medium">{item.TRACENUM}</span>
                  </div>
                )}



                {item.STATUS && (
                  <div className="bg-base-200/70 rounded-lg p-2">
                    <p className="text-xs opacity-60 mb-1">Status</p>
                    <p className={`font-medium ${item.STATUS === 'R' ? 'text-error' : ''}`}>
                      {processPaymentType(item.STATUS)}
                    </p>
                  </div>
                )}

                {/* Added REVDATE field */}
                {item.REVDATE && (
                  <div className="bg-base-200/70 rounded-lg p-2">
                    <p className="text-xs opacity-60 mb-1">Reversal Date</p>
                    <p className="font-medium">{new Date(item.REVDATE).toLocaleDateString()}</p>
                  </div>
                )}

              </div>

              {item.REMARK && (
                <div className="mt-3 bg-base-200/50 p-3 rounded-lg">
                  <p className="text-xs opacity-70 mb-1 font-medium">Remarks</p>
                  <p className="text-sm whitespace-pre-wrap">{item.REMARK}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

DocumentInfo.displayName = 'DocumentInfo'; // For better debugging in React DevTools

export default DocumentInfo;
