import { useState } from 'react';

interface VerifiedClaim {
  text: string;
  isTrue: boolean;
  explanation: string;
  primarySource: string
}

interface Stats {
  total: number;
  true: number;
  false: number;
}

interface AnalysisResult {
  content: string;
  truthValue: number;
  claims: VerifiedClaim[];
  stats: Stats;
}

interface ApiResponse {
  content: string;
  truthValue: number;
  claims: Array<{
    text: string;
    isTrue: boolean;
    explanation: string;
    primarySource: string;
  }>;
  stats: {
    total: number;
    true: number;
    false: number;
  };
}

export const useClaimAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [claimStats, setClaimStats] = useState<Stats>({
    total: 0,
    true: 0,
    false: 0
  });

  const analyzeContent = async (content: string): Promise<AnalysisResult> => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('https://truthlens-j6ky.onrender.com/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      console.log(response)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      
      setClaimStats(data.stats);

      // Highlight claims in the content
      let highlightedContent = content;
      data.claims.forEach(claim => {
        const color = claim.isTrue 
          ? 'bg-green-500/20 text-green-700 dark:text-green-300'
          : 'bg-red-500/20 text-red-700 dark:text-red-300';

        const sentenceRegex = new RegExp(`[^.!?]*${claim.text}[^.!?]*[.!?]`, 'gi');
        highlightedContent = highlightedContent.replace(
          sentenceRegex,
          (match) => `<span class="px-1 rounded ${color}" title="${claim.explanation}">${match}</span>`
        );
      });

      return {
        content: highlightedContent,
        truthValue: data.truthValue,
        claims: data.claims,
        stats: data.stats
      };

    } catch (error) {
      console.error('Error analyzing content:', error);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return { analyzeContent, isAnalyzing, claimStats };
};