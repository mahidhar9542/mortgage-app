import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { uploadDocument } from '@/lib/dashboardApi';
import { Upload, FileText, X } from 'lucide-react';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  onUploadSuccess?: () => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  applicationId,
  onUploadSuccess
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'File size must be less than 10MB',
          variant: 'destructive',
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !documentType) {
      toast({
        title: 'Error',
        description: 'Please select a file and document type',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await uploadDocument(selectedFile, applicationId, documentType);
      toast({
        title: 'Success',
        description: 'Document uploaded successfully',
      });
      setSelectedFile(null);
      setDocumentType('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onUploadSuccess?.();
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="documentType">Document Type</Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pay_stubs">Pay Stubs</SelectItem>
                <SelectItem value="w2_forms">W-2 Forms</SelectItem>
                <SelectItem value="bank_statements">Bank Statements</SelectItem>
                <SelectItem value="government_id">Government ID</SelectItem>
                <SelectItem value="proof_of_income">Proof of Income</SelectItem>
                <SelectItem value="tax_returns">Tax Returns</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="file">Select File</Label>
            <div className="mt-2">
              <input
                ref={fileInputRef}
                type="file"
                id="file"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>
            
            {selectedFile && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm">{selectedFile.name}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="text-xs text-gray-500">
            <p>Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG, GIF</p>
            <p>Maximum file size: 10MB</p>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !selectedFile || !documentType}>
              {isLoading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 