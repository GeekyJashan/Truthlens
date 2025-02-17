import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { useClaimAnalysis } from './useClaimAnalysis';
import { Button } from './components/ui/button';
import { AlertCircle, CheckCircle, ThumbsDown, ThumbsUp, XCircle } from 'lucide-react';
import { Card } from './components/ui/card';

interface Claim {
  id: string;
  text: string;
  isTrue: boolean;
}

type AnalysisResult = {
  content: string;
  stats: { total: number; true: number; false: number; inconclusive: number; };
  claims?: Array<{ id?: string; text: string; isTrue: boolean; }>;
};


const ClaimItem: React.FC<{ claim: Claim }> = ({ claim }) => {
  return (
    <div 
      className={`relative p-4 rounded-lg mb-2 ${
        claim.isTrue 
          ? 'bg-green-50 border border-green-200 dark:bg-green-900/20' 
          : 'bg-red-50 border border-red-200 dark:bg-red-900/20'
      }`}
    >
      <div className="flex items-start gap-3">
        {claim.isTrue ? (
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
        )}
        <p className="text-sm">{claim.text}</p>
      </div>
    </div>
  );
};


const Editor: React.FC = () => {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { isAnalyzing, analyzeContent } = useClaimAnalysis();
  const [analyzedContent, setAnalyzedContent] = useState<{ 
    content: string; 
    stats: { 
      total: number; 
      true: number; 
      false: number; 
    }; 
    claims: Array<{
      claim: string;
      verification: {
        verdict: string;
        confidence: string;
        explanation: string;
      }
    }> 
  } | null>(null);

  const handleAnalyze = async () => {
    try {
      setError(null);
      const result = await analyzeContent(content);
      
      const newStats = {
        total: result.metadata?.total_claims || 0,
        true: result.verified_claims?.filter(c => 
          c.verification.verdict === 'TRUE' && 
          c.verification.confidence === 'HIGH'
        ).length || 0,
        false: result.verified_claims?.filter(c => 
          c.verification.verdict === 'FALSE' && 
          c.verification.confidence === 'HIGH'
        ).length || 0
      };

      setAnalyzedContent({
        content: result.content,
        stats: newStats,
        claims: result.verified_claims || []
      });
    } catch (error) {
      console.error("Analysis failed:", error);
      setError("Failed to analyze content. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Content Editor</h2>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Paste your content here..."
        className="min-h-[200px] p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      <Button 
        onClick={handleAnalyze}
        disabled={!content.trim() || isAnalyzing}
        className="w-full"
      >
        {isAnalyzing ? 'Analyzing...' : 'Analyze Content'}
      </Button>
      
      {analyzedContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Claims</p>
                <p className="text-2xl font-bold">{analyzedContent.stats.total}</p>
              </div>
            </Card>
            <Card className="p-4 flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">True Claims</p>
                <p className="text-2xl font-bold">{analyzedContent.stats.true}</p>
              </div>
            </Card>
            <Card className="p-4 flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">False Claims</p>
                <p className="text-2xl font-bold">{analyzedContent.stats.false}</p>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Analysis Result</h3>
            <div className="space-y-2">
              {analyzedContent.claims.map((item, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    item.verification.verdict === 'TRUE' && item.verification.confidence === 'HIGH'
                      ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                      : item.verification.verdict === 'FALSE' && item.verification.confidence === 'HIGH'
                      ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                      : 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <p>{item.claim}</p>
                    <p className="text-sm opacity-80">{item.verification.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default Editor;