import { ClassificationResult, EmailInput, RequestType, SubRequestType, ExtractedFields } from "@/types/email";
import { v4 as uuidv4 } from 'uuid';
import { pipeline } from "@huggingface/transformers";
import { readFileAsText } from "@/utils/fileUtils";

class EmailService {
  private static textClassifier: any = null;
  private static namedEntityRecognizer: any = null;
  private static previousEmails: { subject: string; body: string }[] = [];

  private static async loadModels() {
    if (!this.textClassifier) {
      try {
        this.textClassifier = await pipeline(
          "text-classification",
          "Xenova/distilbert-base-uncased-finetuned-sst-2-english"
        );
        
        this.namedEntityRecognizer = await pipeline(
          "token-classification",
          "Xenova/bert-base-NER"
        );
        
        console.log("Models loaded successfully");
      } catch (error) {
        console.error("Error loading models:", error);
        throw new Error("Failed to load classification models");
      }
    }
    return { classifier: this.textClassifier, ner: this.namedEntityRecognizer };
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private static async classifyRequestType(text: string): Promise<{ 
    requestType: RequestType; 
    subRequestType: SubRequestType;
    confidenceScore: number;
  }> {
    try {
      const classification = await this.textClassifier(text, { topk: 1 });
      const score = classification[0].score;
      
      let requestType: RequestType = "Adjustment";
      let subRequestType: SubRequestType = "";
      
      const lowerText = text.toLowerCase();
      
      if (lowerText.includes("transfer")) {
        requestType = "AU Transfer";
      } else if (lowerText.includes("closing") || lowerText.includes("notice")) {
        requestType = "Closing Notice";
        
        if (lowerText.includes("reallocation fees")) {
          subRequestType = "Reallocation Fees";
        } else if (lowerText.includes("amendment fees")) {
          subRequestType = "Amendment Fees";
        } else if (lowerText.includes("reallocation principal")) {
          subRequestType = "Reallocation Principal";
        }
      } else if (lowerText.includes("commitment") || lowerText.includes("change")) {
        requestType = "Commitment Change";
        
        if (lowerText.includes("cashless") || lowerText.includes("roll")) {
          subRequestType = "Cashless Roll";
        } else if (lowerText.includes("decrease")) {
          subRequestType = "Decrease";
        } else if (lowerText.includes("increase")) {
          subRequestType = "Increase";
        }
      } else if (lowerText.includes("fee") || lowerText.includes("payment")) {
        requestType = "Fee Payment";
        
        if (lowerText.includes("ongoing")) {
          subRequestType = "Ongoing Fee";
        } else if (lowerText.includes("letter of credit")) {
          subRequestType = "Letter of Credit Fee";
        }
      } else if (lowerText.includes("inbound") || lowerText.includes("fund")) {
        requestType = "Money Movement-Inbound";
        
        if (lowerText.includes("principal") && lowerText.includes("interest") && lowerText.includes("fee")) {
          subRequestType = "Principal+Interest+Fee";
        } else if (lowerText.includes("principal") && lowerText.includes("interest")) {
          subRequestType = "Principal + Interest";
        } else if (lowerText.includes("principal")) {
          subRequestType = "Principal";
        } else if (lowerText.includes("interest")) {
          subRequestType = "Interest";
        }
      } else if (lowerText.includes("outbound") || lowerText.includes("remit")) {
        requestType = "Money Movement - Outbound";
        
        if (lowerText.includes("timebound")) {
          subRequestType = "Timebound";
        } else if (lowerText.includes("foreign") || lowerText.includes("currency")) {
          subRequestType = "Foreign Currency";
        }
      }
      
      return { 
        requestType, 
        subRequestType, 
        confidenceScore: score
      };
    } catch (error) {
      console.error("Error classifying request type:", error);
      return { 
        requestType: "Adjustment", 
        subRequestType: "", 
        confidenceScore: 0.5 
      };
    }
  }

  private static async extractEntities(text: string): Promise<ExtractedFields> {
    try {
      const entities = await this.namedEntityRecognizer(text);
      const extractedFields: ExtractedFields = {};
      
      if (entities && entities.length > 0) {
        const namedEntities = entities.reduce((acc: any, entity: any) => {
          const { entity_group, word } = entity;
          if (!acc[entity_group]) {
            acc[entity_group] = [];
          }
          acc[entity_group].push(word);
          return acc;
        }, {});
        
        if (namedEntities.ORG && namedEntities.ORG.length > 0) {
          extractedFields.borrower = namedEntities.ORG[0].replace(/^##/, '');
          
          if (namedEntities.ORG.length > 1) {
            extractedFields.bank = namedEntities.ORG[1].replace(/^##/, '');
          }
        }
        
        if (namedEntities.LOC && namedEntities.LOC.length > 0) {
          extractedFields.dealName = namedEntities.LOC[0].replace(/^##/, '');
        }
        
        if (namedEntities.MISC && namedEntities.MISC.length > 0) {
          extractedFields.accountNumber = namedEntities.MISC[0].replace(/^##/, '');
        }
      }
      
      const lowerText = text.toLowerCase();
      
      const amountMatch = text.match(/\$\s*([\d,.]+)/i) || 
                          text.match(/USD\s*([\d,.]+)/i) ||
                          text.match(/([\d,.]+)\s*dollars/i);
      if (amountMatch) {
        extractedFields.amount = amountMatch[1].trim();
      }
      
      const dateMatch = text.match(/(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i) ||
                       text.match(/(\w+ \d{1,2},? \d{4})/i);
      if (dateMatch) {
        extractedFields.date = dateMatch[1].trim();
      }
      
      if (!extractedFields.dealName) {
        const dealNameMatch = text.match(/deal(?:\s+name)?[:\s]+([^,.\n]+)/i) ||
                             text.match(/(?:for|regarding)\s+(?:the\s+)?([^,.\n]+)\s+deal/i);
        if (dealNameMatch) {
          extractedFields.dealName = dealNameMatch[1].trim();
        }
      }
      
      return extractedFields;
    } catch (error) {
      console.error("Error extracting entities:", error);
      return {};
    }
  }

  private static checkForDuplicates(subject: string, body: string): boolean {
    for (const prevEmail of this.previousEmails) {
      if (
        prevEmail.subject === subject || 
        prevEmail.body === body ||
        this.calculateSimilarity(prevEmail.body, body) > 0.7
      ) {
        return true;
      }
    }
    return false;
  }

  private static calculateSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }

  private static async extractEmailFromFile(file: File): Promise<{ subject: string; body: string }> {
    try {
      const fileContent = await readFileAsText(file);
      
      let subject = "";
      let body = fileContent;
      
      const subjectMatch = fileContent.match(/subject:(.+?)(\r?\n|\r)/i);
      if (subjectMatch && subjectMatch[1]) {
        subject = subjectMatch[1].trim();
        body = fileContent.replace(/subject:(.+?)(\r?\n|\r)/i, '').trim();
      } else {
        const lines = fileContent.split(/\r?\n/);
        if (lines.length > 0) {
          subject = lines[0].trim();
          body = lines.slice(1).join('\n').trim();
        } else {
          subject = file.name;
        }
      }
      
      return { subject, body };
    } catch (error) {
      console.error('Error extracting email from file:', error);
      return { 
        subject: file.name, 
        body: `Failed to extract content from ${file.name}` 
      };
    }
  }

  public static async classifyEmail(emailInput: EmailInput): Promise<ClassificationResult> {
    await this.loadModels();
    
    await this.delay(500);
    
    let subject = emailInput.subject;
    let body = emailInput.body;
    
    if ((!subject || !body) && emailInput.attachments.length > 0) {
      const extractedEmail = await this.extractEmailFromFile(emailInput.attachments[0]);
      subject = extractedEmail.subject;
      body = extractedEmail.body;
    }
    
    const combinedText = `${subject} ${body}`;
    
    const { requestType, subRequestType, confidenceScore } = await this.classifyRequestType(combinedText);
    
    const extractedFields = await this.extractEntities(combinedText);
    
    const isDuplicate = this.checkForDuplicates(subject, body);
    
    this.previousEmails.push({ subject, body });
    if (this.previousEmails.length > 20) {
      this.previousEmails.shift();
    }
    
    return {
      id: uuidv4(),
      emailSubject: subject,
      emailBody: body,
      attachments: emailInput.attachments.map(file => file.name),
      requestType,
      subRequestType,
      confidenceScore,
      isPrimaryIntent: true,
      extractedFields,
      isDuplicate,
      duplicateReason: isDuplicate ? "Similar email found in the previous submissions" : undefined,
      createdAt: new Date(),
      assignedTeam: this.getAssignedTeam(requestType)
    };
  }
  
  public static getAssignedTeam(requestType: RequestType): string {
    const teamMapping: Record<RequestType, string> = {
      "Adjustment": "Servicing Team",
      "AU Transfer": "Transfer Team",
      "Closing Notice": "Closing Team",
      "Commitment Change": "Credit Team",
      "Fee Payment": "Finance Team",
      "Money Movement-Inbound": "Treasury Team",
      "Money Movement - Outbound": "Treasury Team"
    };
    
    return teamMapping[requestType] || "General Team";
  }
  
  public static async createTicket(result: ClassificationResult): Promise<{ ticketId: string, success: boolean }> {
    await this.delay(1000);
    
    return {
      ticketId: `TICKET-${Math.floor(Math.random() * 10000)}`,
      success: true
    };
  }
}

export default EmailService;
