
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, X, AlertCircle } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  status: 'required' | 'uploaded' | 'approved' | 'rejected';
  uploadedAt?: string;
  description: string;
}

const DocumentUpload = () => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Recent Pay Stubs',
      type: 'income',
      status: 'required',
      description: 'Last 2 pay stubs showing year-to-date earnings'
    },
    {
      id: '2',
      name: 'Tax Returns',
      type: 'income',
      status: 'uploaded',
      uploadedAt: '2024-03-15',
      description: 'Last 2 years of tax returns (2022, 2023)'
    },
    {
      id: '3',
      name: 'Bank Statements',
      type: 'asset',
      status: 'approved',
      uploadedAt: '2024-03-14',
      description: 'Last 2 months of checking and savings statements'
    },
    {
      id: '4',
      name: 'Employment Letter',
      type: 'income',
      status: 'rejected',
      uploadedAt: '2024-03-13',
      description: 'Letter from employer confirming employment and salary'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'required': return 'bg-red-100 text-red-800';
      case 'uploaded': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'required': return <AlertCircle className="w-4 h-4" />;
      case 'uploaded': return <FileText className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <X className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const handleFileUpload = (docId: string, files: FileList | null) => {
    if (files && files.length > 0) {
      setDocuments(docs => 
        docs.map(doc => 
          doc.id === docId 
            ? { ...doc, status: 'uploaded' as const, uploadedAt: new Date().toISOString().split('T')[0] }
            : doc
        )
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Required Documents</CardTitle>
        <p className="text-gray-600">
          Upload the following documents to complete your application
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium text-gray-900">{doc.name}</h3>
                    <Badge className={getStatusColor(doc.status)}>
                      {getStatusIcon(doc.status)}
                      <span className="ml-1 capitalize">{doc.status}</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{doc.description}</p>
                  {doc.uploadedAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                
                <div className="flex-shrink-0 ml-4">
                  {doc.status === 'required' || doc.status === 'rejected' ? (
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(doc.id, e.target.files)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Button size="sm" className="bg-[#0054ff] hover:bg-blue-600">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  )}
                </div>
              </div>
              
              {doc.status === 'rejected' && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm text-red-700">
                    Document was rejected: The employment letter needs to be on official company letterhead and signed by HR.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800">Upload Guidelines</h4>
              <ul className="text-sm text-blue-700 mt-1 space-y-1">
                <li>• Accepted formats: PDF, JPG, PNG</li>
                <li>• Maximum file size: 10MB per document</li>
                <li>• Ensure all pages are clear and readable</li>
                <li>• Remove any sensitive information not required</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;
