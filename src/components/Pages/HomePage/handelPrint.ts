import { maskAccount, maskEmail, maskPAN, maskPhone } from "../../../utils/maskData"

  export default function handlePrint(searchResult: any) {
    const printContents = `<html>
        <head>
          <title>Dispute Details - ${searchResult?.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .section-title { font-weight: bold; margin-bottom: 10px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .label { font-weight: bold; margin-right: 10px; }
            .divider { border-top: 1px solid #ccc; margin: 20px 0; }
            .badge { 
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: bold;
            }
            .badge-success { background: #4caf50; color: white; }
            .badge-warning { background: #ff9800; color: white; }
            .badge-error { background: #f44336; color: white; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Dispute Details - #${searchResult?.id}</h1>
            <p>Generated on: ${new Date().toLocaleString()}</p>
          </div>
          
          <div class="section">
            <div class="grid">
              <div>
                <div class="section-title">Transaction Details</div>
                <p><span class="label">Amount:</span> ${searchResult?.amount
      }</p>
                <p><span class="label">PAN:</span> ${searchResult && maskPAN(searchResult?.PAN)}</p>
                <p><span class="label">Terminal:</span> ${searchResult?.terminalid
      }</p>
                <p><span class="label">Merchant:</span> ${searchResult?.merchant
      }</p>
                <p><span class="label">Location:</span> ${searchResult?.location
      }</p>
              </div>
              <div>
                <div class="section-title">Customer Details</div>
                <p><span class="label">Customer ID:</span> ${searchResult?.expand?.customer?.cfid || "N/A"
      }</p>
                <p><span class="label">Name:</span> ${searchResult?.expand?.customer?.name || "N/A"
      }</p>
                <p><span class="label">Account:</span> ${searchResult?.expand?.customer?.account
        ? maskAccount(searchResult.expand.customer.account)
        : "N/A"
      }</p>
                <p><span class="label">Phone:</span> ${searchResult?.expand?.customer?.phone
        ? maskPhone(searchResult.expand.customer.phone)
        : "N/A"
      }</p>
                <p><span class="label">Email:</span> ${searchResult?.expand?.customer?.email
        ? maskEmail(searchResult.expand.customer.email)
        : "N/A"
      }</p>
              </div>
            </div>
          </div>
          <div class="divider"></div>
          <div class="section">
            <div class="grid">
              <div>
                <div class="section-title">Dates</div>
                <p><span class="label">Transaction Date:</span> ${new Date(
        searchResult?.transaction_date || ""
      ).toLocaleString()}</p>
                <p><span class="label">Report Date:</span> ${new Date(
        searchResult?.created || ""
      ).toLocaleString()}</p>
              </div>
              <div>
                <div class="section-title">Status</div>
                <p><span class="label">Current Status:</span> 
                  <span class="badge badge-${searchResult?.status === "resolved"
        ? "resolved"
        : searchResult?.status === "pending"
          ? "warning"
          : "error"
      }">
                    ${searchResult?.status?.toUpperCase()}
                  </span>
                </p>
                <p><span class="label">Phoenix Status:</span> ${searchResult?.phoenix_status
      }</p>
                <p><span class="label">Issue By:</span> ${searchResult?.issue_by
      }</p>
              </div>
            </div>
          </div>
          <div class="divider"></div>
          <div class="section">
            <div class="section-title">Remarks</div>
            <p>${searchResult?.remarks || "No remarks"}</p>
          </div>
        </body>
      </html>         
    `
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(printContents)
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
    }
  }