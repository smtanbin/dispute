import { useState, useEffect, ChangeEvent } from "react";
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
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [fileContent, setFileContent] = useState<string | null>(null); // For text file content
  const [fileType, setFileType] = useState<'image' | 'text' | 'unknown'>('unknown');
  const [showSwitchOutputModal, setShowSwitchOutputModal] = useState<boolean>(false);
  const [switchOutputText, setSwitchOutputText] = useState<string>('');
  // Add confirmation dialog state
  const [showDiscardConfirm, setShowDiscardConfirm] = useState<boolean>(false);

  // New state variables for editing
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<Partial<DisputeRecord>>({});
  const [uploadingEJ, setUploadingEJ] = useState<boolean>(false);
  const [uploadingDocs, setUploadingDocs] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [resolveLoading, setResolveLoading] = useState<boolean>(false);
  const [showDmsModal, setShowDmsModal] = useState<boolean>(false);
  const [dmsId, setDmsId] = useState<string>("");
  const [dmsLoading, setDmsLoading] = useState<boolean>(false);

  // Add states for upload progress and status
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStatus, setUploadStatus] = useState<{
    show: boolean;
    success: boolean;
    message: string;
    type: 'EJ' | 'supporting_doc' | null;
  }>({ show: false, success: false, message: '', type: null });

  useEffect(() => {
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

  // Initialize edit data when dispute record changes
  useEffect(() => {
    if (disputeRecord) {
      setEditData({
        persial: disputeRecord.persial || "",
        resolve: disputeRecord.resolve || "",
        DMSRaiseDate: disputeRecord.DMSRaiseDate || "",
        phoenix_status: disputeRecord.phoenix_status || "",
        RRNSTAN: disputeRecord.RRNSTAN || "",
        remarks: disputeRecord.remarks || "",
        DMS_ID: disputeRecord.DMS_ID || ""
      });
    }
  }, [disputeRecord]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 mt-4">
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

  // Handle file preview logic
  const handleFilePreview = async (filename: string) => {
    setSelectedFile(filename);
    setShowModal(true);

    // Determine file type by extension
    const isTextFile = filename.toLowerCase().endsWith('.txt') ||
      filename.toLowerCase().endsWith('.log') ||
      filename.toLowerCase().endsWith('.json');

    if (isTextFile) {
      setFileType('text');
      try {
        // Fetch the text content for text files
        const url = getFileUrl(filename, disputeRecord.EJ?.includes(filename) ? 'EJ' : 'supporting_doc');
        const response = await fetch(url);
        const text = await response.text();
        setFileContent(convertToRichText(text)); // Convert to rich text

      } catch (err) {
        console.error("Failed to load file content:", err);
        setFileContent("Error loading file content");
      }
    } else if (filename.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp)$/)) {
      setFileType('image');
      setFileContent(null);
    } else if (filename.toLowerCase().endsWith('.pdf')) {
      // Set type to unknown for PDF since we can't preview it directly
      setFileType('unknown');
      setFileContent(null);
    } else {
      setFileType('unknown');
      setFileContent(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFile(null);
    setFileContent(null);
    setFileType('unknown');
  };

  // Modified discardFile to show confirmation first
  const promptDiscardFile = () => {
    setShowDiscardConfirm(true);
  };

  const discardFile = async () => {
    if (!selectedFile || !disputeRecord?.id) return;

    try {
      const collection = disputeRecord.EJ?.includes(selectedFile) ? 'EJ' : 'supporting_doc';

      // Create an updated list of files without the selected file
      const updatedFiles = collection === 'EJ'
        ? disputeRecord.EJ?.filter(f => f !== selectedFile)
        : disputeRecord.supporting_doc?.filter(f => f !== selectedFile);

      // Create an update object with just the field we want to update
      const updateData = { [collection]: updatedFiles };

      // Update the record
      const updatedRecord = await pb.collection('disputes').update(disputeRecord.id, updateData);
      setDisputeRecord(updatedRecord as unknown as DisputeRecord);

      // Close the modal and confirmation dialog
      setShowDiscardConfirm(false);
      closeModal();
    } catch (err: any) {
      console.error("Failed to discard file:", err);
      setError(`Failed to discard file: ${err.message}`);
    }
  };

  const getFileUrl = (filename: string, collection: 'EJ' | 'supporting_doc') => {
    if (!disputeRecord || !filename) return '';
    return pb.files.getUrl(disputeRecord, filename, { field: collection });
  };

  // Handle field changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  // Handle file uploads - modified to properly handle log files
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>, field: 'EJ' | 'supporting_doc') => {
    if (!e.target.files || !e.target.files.length || !disputeRecord?.id) return;

    try {
      const isEJ = field === 'EJ';
      isEJ ? setUploadingEJ(true) : setUploadingDocs(true);

      // Reset upload status and progress
      setUploadProgress(0);
      setUploadStatus({ show: false, success: false, message: '', type: null });

      const formData = new FormData();

      // Process each file
      for (const file of Array.from(e.target.files)) {
        if (isEJ && file.name.toLowerCase().endsWith('.log')) {
          try {
            // Read the log file content
            const logContent = await file.text();

            // Create a new file with .txt extension
            const newFileName = file.name.replace(/\.log$/i, '.txt');
            const newFile = new File(
              [logContent],
              newFileName,
              { type: 'text/plain' }
            );

            formData.append(field, newFile);

            // Also store the log content as EJ text if it's an EJ file
            if (field === 'EJ') {
              formData.append('switch_output', convertToRichText(logContent));
            }
          } catch (readErr) {
            console.error("Error reading log file:", readErr);
            // If reading fails, just upload the original file
            formData.append(field, file);
          }
        } else {
          // Use the original file
          formData.append(field, file);
        }
      }

      // Simulate progress - in a real app, you'd use an upload progress event handler
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 300);

      const updatedRecord = await pb.collection('disputes').update(disputeRecord.id, formData);
      setDisputeRecord(updatedRecord as unknown as DisputeRecord);

      // Clear interval and set to 100%
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Show success message
      setUploadStatus({
        show: true,
        success: true,
        message: `${isEJ ? 'EJ' : 'Supporting'} files uploaded successfully!`,
        type: field
      });

      // Reset the file input value
      e.target.value = '';

      // Hide success message after 5 seconds
      setTimeout(() => {
        setUploadStatus(prev => ({ ...prev, show: false }));
      }, 5000);

    } catch (err: any) {
      console.error(`Failed to upload ${field} files:`, err);
      setError(`Upload failed: ${err.message}`);

      // Show error message
      setUploadStatus({
        show: true,
        success: false,
        message: `Upload failed: ${err.message}`,
        type: field
      });
    } finally {
      const isEJ = field === 'EJ';
      isEJ ? setUploadingEJ(false) : setUploadingDocs(false);
    }
  };

  // Convert plain text to rich text
  const convertToRichText = (content: string) => {
    // Implement the logic to convert plain text to rich text
    // For simplicity, let's assume it wraps the content in <pre> tags
    return `<pre>${content}</pre>`;
  };

  // Download the currently selected file
  const downloadFile = () => {
    if (!selectedFile || !disputeRecord) return;

    try {
      const collection = disputeRecord.EJ?.includes(selectedFile) ? 'EJ' : 'supporting_doc';
      const url = getFileUrl(selectedFile, collection);

      // Create an anchor element and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedFile; // Set the filename
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err: any) {
      console.error("Failed to download file:", err);
      setError(`Download failed: ${err.message}`);
    }
  };

  // Save edited data
  const handleSave = async () => {
    if (!disputeRecord?.id) return;

    try {
      setSaveLoading(true);
      const updatedRecord = await pb.collection('disputes').update(disputeRecord.id, editData);
      setDisputeRecord(updatedRecord as unknown as DisputeRecord);
      setIsEditing(false);
    } catch (err: any) {
      console.error("Failed to update dispute:", err);
      setError(`Update failed: ${err.message}`);
    } finally {
      setSaveLoading(false);
    }
  };

  // Handle resolving the dispute
  const handleResolve = async () => {
    if (!disputeRecord?.id) return;

    try {
      setResolveLoading(true);
      const updatedData = { resolve: "Resolved" };
      const updatedRecord = await pb.collection('disputes').update(disputeRecord.id, updatedData);
      setDisputeRecord(updatedRecord as unknown as DisputeRecord);
      // Update edit data to reflect changes
      setEditData(prev => ({ ...prev, resolve: "Resolved" }));
    } catch (err: any) {
      console.error("Failed to resolve dispute:", err);
      setError(`Resolve failed: ${err.message}`);
    } finally {
      setResolveLoading(false);
    }
  };

  // Handle raising to BB DMS
  const handleRaiseToDms = async () => {
    if (!disputeRecord?.id || !dmsId.trim()) return;

    try {
      setDmsLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const updatedData = {
        DMS_ID: dmsId.trim(),
        DMSRaiseDate: today,
        status: "raised"
      };

      const updatedRecord = await pb.collection('disputes').update(disputeRecord.id, updatedData);
      setDisputeRecord(updatedRecord as unknown as DisputeRecord);

      // Update edit data to reflect changes
      setEditData(prev => ({
        ...prev,
        DMS_ID: dmsId.trim(),
        DMSRaiseDate: today,
      }));

      setShowDmsModal(false);
      setDmsId("");
    } catch (err: any) {
      console.error("Failed to raise to DMS:", err);
      setError(`DMS update failed: ${err.message}`);
    } finally {
      setDmsLoading(false);
    }
  };

  // Handle Switch Output save
  const handleSaveSwitchOutput = async () => {
    if (!disputeRecord?.id) return;

    try {
      setSaveLoading(true);
      const updatedRecord = await pb.collection('disputes').update(disputeRecord.id, {
        switch_output: switchOutputText
      });
      setDisputeRecord(updatedRecord as unknown as DisputeRecord);
      setShowSwitchOutputModal(false);
    } catch (err: any) {
      console.error("Failed to update switch output:", err);
      setError(`Update failed: ${err.message}`);
    } finally {
      setSaveLoading(false);
    }
  };

  const renderFileList = (files: string[] | undefined, type: 'EJ' | 'supporting_doc') => {
    if (!files || files.length === 0) {
      return <p className="text-sm italic">No files available</p>;
    }

    return (
      <ul className="space-y-2">
        {files.map((file, index) => (
          <li key={index} className="flex items-center justify-between bg-base-300 p-2 rounded">
            <span className="truncate text-sm">{file}</span>
            <button
              className="btn btn-xs btn-outline"
              onClick={() => handleFilePreview(file)}
            >
              View
            </button>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <div className="container mx-auto p-4 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            <button
              className="btn  mr-5"
              onClick={() => navigate('/dispute')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>

            </button>
            Dispute Details</h1>

        </div>

        <br />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="md:col-span-2 bg-base-200 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                {isEditing ? (
                  <input
                    type="text"
                    name="RRNSTAN"
                    value={editData.RRNSTAN || ""}
                    onChange={handleChange}
                    className="input input-bordered input-sm mt-1"
                  />
                ) : (
                  <span className="font-mono">{disputeRecord.RRNSTAN || "-"}</span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm opacity-70">Phoenix Status</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="phoenix_status"
                    value={editData.phoenix_status || ""}
                    onChange={handleChange}
                    className="input input-bordered input-sm mt-1"
                  />
                ) : (
                  <span>{disputeRecord.phoenix_status || "-"}</span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm opacity-70">DMS Raise Date</span>
                {isEditing ? (
                  <input
                    type="date"
                    name="DMSRaiseDate"
                    value={editData.DMSRaiseDate || ""}
                    onChange={handleChange}
                    className="input input-bordered input-sm mt-1"
                    disabled={true}
                  />
                ) : (
                  <span>{disputeRecord.DMSRaiseDate || "-"}</span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm opacity-70">Resolve</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="resolve"
                    value={editData.resolve || ""}
                    onChange={handleChange}
                    className="input input-bordered input-sm mt-1"
                  />
                ) : (
                  <span>{disputeRecord.resolve || "-"}</span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm opacity-70">Persial</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="persial"
                    value={editData.persial || ""}
                    onChange={handleChange}
                    className="input input-bordered input-sm mt-1"
                  />
                ) : (
                  <span>{disputeRecord.persial || "-"}</span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm opacity-70">DMS ID</span>
                <span>{disputeRecord.DMS_ID || "-"}</span>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="md:col-span-1">
            {/* Actions */}
            <div className="bg-base-200 p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Actions</h2>
              <div className="flex flex-col gap-3">
                {isEditing ? (
                  <>
                    <button
                      className="btn btn-outline btn-block"
                      onClick={() => setIsEditing(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </button>
                    <button
                      className={`btn btn-primary btn-block ${saveLoading ? 'loading' : ''}`}
                      onClick={handleSave}
                      disabled={saveLoading}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Changes
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-outline btn-block"
                      onClick={() => setIsEditing(true)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Details
                    </button>
                    <button
                      className={`btn btn-success btn-block ${resolveLoading ? 'loading' : ''}`}
                      onClick={handleResolve}
                      disabled={resolveLoading}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Resolve Dispute
                    </button>
                    <button
                      className="btn btn-warning btn-block"
                      onClick={() => setShowDmsModal(true)}
                      disabled={!!disputeRecord.DMS_ID}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Raise to BB DMS
                    </button>
                    <button className="btn btn-primary btn-block">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Update Status
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="bg-base-200 p-6 rounded-lg shadow-sm mb-6">

              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Remarks</h2>
              {isEditing ? (
                <textarea
                  name="remarks"
                  value={editData.remarks || ""}
                  onChange={handleChange}
                  className="textarea textarea-bordered w-full min-h-[100px]"
                ></textarea>
              ) : (
                <div className="p-3 bg-base-300 rounded-md min-h-[60px]">
                  {disputeRecord.remarks || "No remarks provided"}
                </div>
              )}
            </div>
            <div className="bg-base-200 p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">EJ Files</h2>
              {renderFileList(disputeRecord.EJ, 'EJ')}

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Upload EJ Files</label>
                <input
                  type="file"
                  className="file-input file-input-bordered file-input-sm w-full"
                  onChange={(e) => handleFileUpload(e, 'EJ')}
                  multiple
                  disabled={uploadingEJ}
                />
                {uploadingEJ && (
                  <div className="mt-2">
                    <progress
                      className="progress progress-primary w-full"
                      value={uploadProgress}
                      max="100"
                    ></progress>
                    <span className="ml-2 text-sm">Uploading... {uploadProgress}%</span>
                  </div>
                )}
                {uploadStatus.show && uploadStatus.type === 'EJ' && (
                  <div className={`alert ${uploadStatus.success ? 'alert-success' : 'alert-error'} mt-2`}>
                    <div>
                      {uploadStatus.success ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      <span>{uploadStatus.message}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Switch Output Rich Text - Add this section */}
            <div className="bg-base-200 p-6 rounded-lg shadow-sm mb-6">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className="text-xl font-semibold">Switch Output</h2>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => {
                    setSwitchOutputText(disputeRecord.switch_output || '');
                    setShowSwitchOutputModal(true);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
              </div>
              {disputeRecord.switch_output ? (
                <div className="bg-base-300 p-3 rounded-md overflow-auto max-h-[300px]">
                  <pre className="text-sm font-mono whitespace-pre-wrap">{disputeRecord.switch_output}</pre>
                </div>
              ) : (
                <p className="text-sm italic">No switch output available</p>
              )}
            </div>

            <div className="bg-base-200 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Supporting Documents</h2>
              {renderFileList(disputeRecord.supporting_doc, 'supporting_doc')}

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Upload Supporting Documents</label>
                <input
                  type="file"
                  className="file-input file-input-bordered file-input-sm w-full"
                  onChange={(e) => handleFileUpload(e, 'supporting_doc')}
                  multiple
                  disabled={uploadingDocs}
                />
                {uploadingDocs && (
                  <div className="mt-2">
                    <progress
                      className="progress progress-primary w-full"
                      value={uploadProgress}
                      max="100"
                    ></progress>
                    <span className="ml-2 text-sm">Uploading... {uploadProgress}%</span>
                  </div>
                )}
                {uploadStatus.show && uploadStatus.type === 'supporting_doc' && (
                  <div className={`alert ${uploadStatus.success ? 'alert-success' : 'alert-error'} mt-2`}>
                    <div>
                      {uploadStatus.success ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      <span>{uploadStatus.message}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* File Preview Modal */}
      {(showModal && selectedFile) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="modal-box w-11/12 max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">
                {selectedFile}
              </h3>
              <div className="flex gap-2">
                <button
                  className="btn btn-outline"
                  onClick={downloadFile}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
                <button
                  className="btn btn-error"
                  onClick={promptDiscardFile}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Discard
                </button>
                <button
                  className="btn btn-warning"
                  onClick={closeModal}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Close
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden">
              {fileType === 'image' ? (
                <img
                  src={getFileUrl(selectedFile,
                    disputeRecord.EJ?.includes(selectedFile) ? 'EJ' : 'supporting_doc'
                  )}
                  alt={selectedFile}
                  className="max-h-[70vh] w-auto mx-auto object-contain"
                />
              ) : fileType === 'text' ? (
                <div className="bg-base-300 p-4 rounded-md max-h-[70vh] overflow-auto">
                  <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                    {fileContent}
                  </pre>
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p>This file type cannot be previewed directly.</p>
                  <p>Please download the file to view it.</p>
                </div>
              )}
            </div>

          </div>
        </div >
      )
      }

      {/* Discard Confirmation Modal */}
      {
        showDiscardConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="modal-box w-11/12 max-w-md">
              <h3 className="font-bold text-lg">Confirm Discard</h3>
              <p className="py-4">Are you sure you want to discard "{selectedFile}"? This action cannot be undone.</p>
              <div className="modal-action">
                <button className="btn btn-outline" onClick={() => setShowDiscardConfirm(false)}>
                  Cancel
                </button>
                <button className="btn btn-error" onClick={discardFile}>
                  Yes, Discard
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* DMS Raise Modal */}
      {
        showDmsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="modal-box w-11/12 max-w-md">
              <h3 className="font-bold text-lg mb-4">Raise Dispute to BB DMS</h3>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Enter DMS ID</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={dmsId}
                  onChange={(e) => setDmsId(e.target.value)}
                  placeholder="DMS ID"
                />
              </div>
              <div className="modal-action">
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setShowDmsModal(false);
                    setDmsId("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className={`btn btn-primary ${dmsLoading ? 'loading' : ''}`}
                  onClick={handleRaiseToDms}
                  disabled={!dmsId.trim() || dmsLoading}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Switch Output Modal */}
      {
        showSwitchOutputModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="modal-box w-11/12 max-w-3xl">
              <h3 className="font-bold text-lg mb-4">Edit Switch Output</h3>
              <div className="form-control w-full">
                <textarea
                  className="textarea textarea-bordered w-full h-80 font-mono text-sm"
                  value={switchOutputText}
                  onChange={(e) => setSwitchOutputText(e.target.value)}
                  placeholder="Enter switch output text here..."
                ></textarea>
              </div>
              <div className="modal-action">
                <button
                  className="btn btn-outline"
                  onClick={() => setShowSwitchOutputModal(false)}
                >
                  Cancel
                </button>
                <button
                  className={`btn btn-primary ${saveLoading ? 'loading' : ''}`}
                  onClick={handleSaveSwitchOutput}
                  disabled={saveLoading}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
}