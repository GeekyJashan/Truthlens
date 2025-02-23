import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Upload, FileText, CheckCircle, XCircle } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  date: string;
  trueClaimsCount: number;
  falseClaimsCount: number;
}

const Dashboard: React.FC = () => {
  // Mock data for user's documents
  const documents: Document[] = [
    { id: '1', title: 'News Article 1', date: '2023-05-15', trueClaimsCount: 8, falseClaimsCount: 2 },
    { id: '2', title: 'Blog Post', date: '2023-05-10', trueClaimsCount: 5, falseClaimsCount: 3 },
    { id: '3', title: 'Research Paper', date: '2023-05-05', trueClaimsCount: 12, falseClaimsCount: 1 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Your Dashboard</h2>
        <Button>
          <Upload className="mr-2 h-4 w-4" /> Upload Document
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border p-4 rounded-md shadow-sm"
          >
            <div className="flex items-center mb-2">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              <h3 className="font-semibold">{doc.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-2">Analyzed on: {doc.date}</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                <span className="text-sm">{doc.trueClaimsCount} true claims</span>
              </div>
              <div className="flex items-center">
                <XCircle className="h-4 w-4 mr-1 text-red-500" />
                <span className="text-sm">{doc.falseClaimsCount} false claims</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;