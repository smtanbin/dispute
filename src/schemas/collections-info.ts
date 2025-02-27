/**
 * This file contains documentation about the PocketBase collections used in the dispute management system.
 * It can be used for reference when working with the collections.
 */

/**
 * Dispute Transaction Collection (dispute_tr)
 * 
 * This collection stores transaction-related dispute information
 */
export interface DisputeTrSchema {
  id: string;
  created: string;
  updated: string;
  
  // Transaction details
  transaction_date: string;
  transaction_amount: string;
  merchant_name: string;
  terminal_id: string;
  approval_code: string;
  
  // Reference numbers
  RRNSTAN: string;
  reference_number: string;
  
  // Card information
  card_number: string; // Masked card number
  card_type: string;   // Debit, Credit, etc.
  card_brand: string;  // Visa, Mastercard, etc.
  
  // Transaction status
  transaction_status: string;
  response_code: string;
  
  // Foreign keys
  dispute_id: string; // Reference to the main dispute
  channel_id: string; // Payment channel used
}

/**
 * Dispute Client Collection (dispute_client)
 * 
 * This collection stores client/customer information for disputes
 */
export interface DisputeClientSchema {
  id: string;
  created: string;
  updated: string;
  
  // Client details
  name: string;
  email: string;
  phone: string;
  address: string;
  
  // Company details (for corporate clients)
  company_name?: string;
  company_id?: string;
  
  // Identification
  id_type: string;      // NID, Passport, etc.
  id_number: string;
  
  // Account information
  account_number?: string;
  account_type?: string;
  
  // Foreign key
  dispute_ids: string[]; // References to disputes filed by this client
}

/**
 * Sample usage of these collections with PocketBase client:
 * 
 * // Fetch transaction details for a dispute
 * const transactionDetails = await pb.collection('dispute_tr').getFirstListItem(`dispute_id="${disputeId}"`);
 * 
 * // Fetch client information for a dispute
 * const clientInfo = await pb.collection('dispute_client').getOne(dispute.client_id);
 */
