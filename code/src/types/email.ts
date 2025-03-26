
export type RequestType = 
  | "Adjustment"
  | "AU Transfer"
  | "Closing Notice"
  | "Commitment Change"
  | "Fee Payment"
  | "Money Movement-Inbound"
  | "Money Movement - Outbound";

export type SubRequestType = 
  | "Reallocation Fees"
  | "Amendment Fees"
  | "Reallocation Principal"
  | "Cashless Roll"
  | "Decrease"
  | "Increase"
  | "Ongoing Fee"
  | "Letter of Credit Fee"
  | "Principal"
  | "Interest"
  | "Principal + Interest"
  | "Principal+Interest+Fee"
  | "Timebound"
  | "Foreign Currency"
  | "";

export interface ExtractedFields {
  dealName?: string;
  borrower?: string;
  amount?: string;
  date?: string;
  bank?: string;
  accountNumber?: string;
  [key: string]: string | undefined;
}

export interface ClassificationResult {
  id: string;
  emailSubject: string;
  emailBody: string;
  attachments: string[];
  requestType: RequestType;
  subRequestType: SubRequestType;
  confidenceScore: number;
  isPrimaryIntent: boolean;
  extractedFields: ExtractedFields;
  isDuplicate: boolean;
  duplicateReason?: string;
  createdAt: Date;
  assignedTeam?: string;
}

export interface EmailInput {
  subject: string;
  body: string;
  attachments: File[];
}
