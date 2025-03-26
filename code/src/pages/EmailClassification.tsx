
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EmailForm from "@/components/email/EmailForm";
import ClassificationResult from "@/components/email/ClassificationResult";
import { EmailInput, ClassificationResult as ClassificationResultType } from "@/types/email";
import EmailService from "@/services/emailService";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EmailClassification: React.FC = () => {
  const [isClassifying, setIsClassifying] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [modelError, setModelError] = useState<string | null>(null);
  const [classificationResult, setClassificationResult] = useState<ClassificationResultType | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize model on component mount
    const initializeModel = async () => {
      try {
        // Call a dummy classification to trigger model loading
        await EmailService.classifyEmail({
          subject: "Model initialization",
          body: "This is a test to initialize the model.",
          attachments: []
        });
        setIsModelLoading(false);
      } catch (error) {
        console.error("Error initializing model:", error);
        setModelError("Failed to load classification model. Please refresh and try again.");
        setIsModelLoading(false);
        
        toast({
          title: "Model Loading Error",
          description: "Failed to load the classification model. Please refresh and try again.",
          variant: "destructive",
        });
      }
    };

    initializeModel();
  }, [toast]);

  const handleSubmit = async (email: EmailInput) => {
    setIsClassifying(true);
    try {
      const result = await EmailService.classifyEmail(email);
      setClassificationResult(result);
    } catch (error) {
      console.error("Error classifying email:", error);
      toast({
        title: "Classification Error",
        description: "An error occurred while classifying the email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsClassifying(false);
    }
  };

  const handleReset = () => {
    setClassificationResult(null);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {isModelLoading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <div className="text-xl font-medium">Loading classification model...</div>
              <div className="text-sm text-muted-foreground mt-2">
                This may take a moment. Please wait.
              </div>
            </CardContent>
          </Card>
        ) : modelError ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-xl font-medium text-destructive">Model Loading Error</div>
              <div className="text-sm text-muted-foreground mt-2">
                {modelError}
              </div>
            </CardContent>
          </Card>
        ) : !classificationResult ? (
          <Card>
            <CardHeader>
              <CardTitle>Email Classification</CardTitle>
              <CardDescription>
                Upload an email file to automatically extract and classify its content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmailForm onSubmit={handleSubmit} isLoading={isClassifying} />
            </CardContent>
          </Card>
        ) : (
          <ClassificationResult result={classificationResult} onReset={handleReset} />
        )}
      </div>
    </Layout>
  );
};

export default EmailClassification;
