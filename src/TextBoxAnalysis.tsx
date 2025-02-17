import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle } from 'lucide-react';
import { analyzeContent } from './modelStub';

const TextBoxAnalysis: React.FC = () => {
  const [content, setContent] = useState('');
  const [analyzedClaims, setAnalyzedClaims] = useState<{ text: string; isTrue: boolean }[]>([]);
  const [analysisStage, setAnalysisStage] = useState<string | null>(null);

  const handleAnalysis = async () => {
    const stages = ['Detecting claims', 'Searching web', 'Compiling results', 'Verifying claims'];
    for (const stage of stages) {
      setAnalysisStage(stage);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate processing time
    }
    setAnalysisStage(null);

    const result = await analyzeContent(content);
    setAnalyzedClaims(result.claims);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Text Box Analysis</h2>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Paste your content here..."
        className="min-h-[200px]"
      />
      <Button onClick={handleAnalysis}>Analyze Content</Button>
      
      {analysisStage && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          className="h-2 bg-gradient-to-r from-primary to-secondary"
        />
      )}
      {analysisStage && (
        <p className="text-center text-muted-foreground">{analysisStage}...</p>
      )}

      {analyzedClaims.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-semibold">Analysis Results</h3>
          {analyzedClaims.map((claim, index) => (
            <div key={index} className="flex items-center space-x-2">
              {claim.isTrue ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span>{claim.text}</span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default TextBoxAnalysis;