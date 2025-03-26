
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { Loader2 } from "lucide-react";
import { EmailInput } from "@/types/email";

interface EmailFormProps {
  onSubmit: (email: EmailInput) => void;
  isLoading: boolean;
}

const EmailForm: React.FC<EmailFormProps> = ({ onSubmit, isLoading }) => {
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Extract subject and body from the first file
    if (attachments.length > 0) {
      // Pass empty strings for subject and body, they will be extracted in the service
      onSubmit({ subject: "", body: "", attachments });
    }
  };

  // Validate if files are selected
  const isFormValid = attachments.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Upload Email File(s)
          </label>
          <FileDropzone
            onFilesAdded={setAttachments}
            currentFiles={attachments}
            accept=".pdf,.docx,.doc,.txt,.jpg,.jpeg,.png,.eml,.msg"
            maxSize={5 * 1024 * 1024} // 5MB
          />
          {attachments.length === 0 && (
            <p className="text-sm text-destructive mt-2">
              Please upload at least one email file
            </p>
          )}
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || !isFormValid}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Classifying Email...
          </>
        ) : (
          "Classify Email"
        )}
      </Button>
    </form>
  );
};

export default EmailForm;
