
import React, { useState } from "react";
import { ClassificationResult as ClassificationResultType } from "@/types/email";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, Check, AlertTriangle, Info, File, ChevronDown, ChevronUp, Ticket } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import EmailService from "@/services/emailService";

interface ClassificationResultProps {
  result: ClassificationResultType;
  onReset: () => void;
}

const ClassificationResult: React.FC<ClassificationResultProps> = ({ result, onReset }) => {
  const { toast } = useToast();
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [ticketCreated, setTicketCreated] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  
  const confidencePercentage = Math.round(result.confidenceScore * 100);
  
  // Format the date
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(result.createdAt);
  
  const handleCreateTicket = async () => {
    setIsCreatingTicket(true);
    
    try {
      const response = await EmailService.createTicket(result);
      
      if (response.success) {
        setTicketCreated(true);
        setTicketId(response.ticketId);
        
        toast({
          title: "Ticket Created",
          description: `Ticket ${response.ticketId} has been created successfully.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create ticket. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingTicket(false);
    }
  };
  
  return (
    <div className="space-y-8 animate-slideUp">
      <Card className="bg-card overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex justify-between items-center">
            <span>Classification Results</span>
            <Badge
              variant={result.isDuplicate ? "destructive" : "default"}
              className="ml-2"
            >
              {result.isDuplicate ? "Duplicate Detected" : "New Request"}
            </Badge>
          </CardTitle>
          <CardDescription>
            Analyzed on {formattedDate}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Request Type Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Request Type</h3>
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground mr-2">Confidence</span>
                <div className="flex items-center space-x-2">
                  <Progress value={confidencePercentage} className="w-24 h-2" />
                  <span className="text-xs font-medium">{confidencePercentage}%</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Primary Request Type</div>
                <div className="font-medium text-lg">{result.requestType}</div>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Sub Request Type</div>
                <div className="font-medium text-lg">{result.subRequestType || "Not Specified"}</div>
              </div>
            </div>
          </div>
          
          {/* Duplicate Warning */}
          {result.isDuplicate && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-destructive">Potential Duplicate Detected</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {result.duplicateReason || "This appears to be a duplicate request based on similar content."}
                </p>
              </div>
            </div>
          )}
          
          {/* Extracted Fields */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="extracted-fields">
              <AccordionTrigger className="text-sm font-medium">
                Extracted Fields
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {Object.entries(result.extractedFields).map(([key, value]) => (
                    <div key={key} className="bg-accent/30 rounded-lg p-3">
                      <div className="text-xs text-muted-foreground capitalize mb-1">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="font-medium">{value || "Not found"}</div>
                    </div>
                  ))}
                  
                  {Object.keys(result.extractedFields).length === 0 && (
                    <div className="col-span-2 text-center py-3 text-sm text-muted-foreground">
                      No fields were extracted from this email.
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Email Details */}
            <AccordionItem value="email-details">
              <AccordionTrigger className="text-sm font-medium">
                Email Details
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Subject</div>
                    <div className="font-medium">{result.emailSubject}</div>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Body</div>
                    <div className="text-sm whitespace-pre-wrap max-h-48 overflow-y-auto custom-scrollbar">
                      {result.emailBody}
                    </div>
                  </div>
                  
                  {result.attachments.length > 0 && (
                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="text-xs text-muted-foreground mb-2">Attachments</div>
                      <div className="space-y-2">
                        {result.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <File className="h-4 w-4 text-muted-foreground" />
                            <span>{attachment}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Assignment Info */}
            <AccordionItem value="assignment">
              <AccordionTrigger className="text-sm font-medium">
                Assignment Information
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  <div className="bg-primary/10 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Assigned Team</div>
                    <div className="font-medium">{result.assignedTeam || "Unassigned"}</div>
                  </div>
                  
                  {ticketCreated && ticketId && (
                    <div className="bg-accent/30 rounded-lg p-3">
                      <div className="text-xs text-muted-foreground mb-1">Ticket ID</div>
                      <div className="font-medium">{ticketId}</div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-6">
          <Button
            variant="outline"
            onClick={onReset}
            className="w-full sm:w-auto"
          >
            Process Another Email
          </Button>
          
          {!ticketCreated ? (
            <Button 
              onClick={handleCreateTicket} 
              disabled={isCreatingTicket || result.isDuplicate}
              className="w-full sm:w-auto"
            >
              {isCreatingTicket ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Ticket...
                </>
              ) : (
                <>
                  <Ticket className="mr-2 h-4 w-4" />
                  Create Service Ticket
                </>
              )}
            </Button>
          ) : (
            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              disabled
            >
              <Check className="mr-2 h-4 w-4" />
              Ticket Created
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ClassificationResult;
