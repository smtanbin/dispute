export interface StatementRecord {
  BALANCE: number;
  CREDIT: number | null;
  DEBIT: number | null;
  REMARK: string;
  TIMESTAMP: string | null;
  TRANSACTION?: string | null;
  DOCTYPE?: string;
}

export interface StatementResponse {
  error: string | null;
  payload: {
    data: StatementRecord[];
  };
}
