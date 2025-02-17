import { useState } from 'react';

interface Claim {
  claim: string;
  verification: 'True' | 'False';
}


interface Verification {
  verdict: 'TRUE' | 'FALSE' | 'INCONCLUSIVE';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  explanation: string;
  evidence: string;
}

interface VerifiedClaim {
  claim: string;
  verification: Verification;
}

interface ApiResponse {
  status: string;
  detected_claims: string[];
  verified_claims: VerifiedClaim[];
  metadata: {
    total_claims: number;
    successfully_verified: number;
  };
}

interface AnalysisResult {
  content: string;
  stats: {
    total: number;
    true: number;
    false: number;
    inconclusive: number;
  };
}

export const useClaimAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [claimStats, setClaimStats] = useState<AnalysisResult['stats']>({
    total: 0,
    true: 0,
    false: 0,
    inconclusive: 0
  });

  const analyzeContent = async (content: string) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/detect_and_verify_claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: content }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      
      // Calculate stats
      const newStats = {
        total: data.metadata.total_claims,
        true: data.verified_claims.filter(c => c.verification.verdict === 'TRUE' && c.verification.confidence === 'HIGH').length,
        false: data.verified_claims.filter(c => c.verification.verdict === 'FALSE' && c.verification.confidence === 'HIGH').length,
        inconclusive: data.verified_claims.filter(c => 
          c.verification.verdict === 'INCONCLUSIVE' || 
          c.verification.confidence !== 'HIGH'
        ).length
      };
      
      setClaimStats(newStats);

      // Highlight claims in the content
      let highlightedContent = content;
      data.verified_claims.forEach(claim => {
        const cleanClaim = claim.claim.replace(/^\d+\.\s*"|"$/g, '').trim();
        let color = 'bg-blue-500/20 text-blue-700 dark:text-blue-300'; // default for inconclusive/low confidence

        if (claim.verification.confidence === 'HIGH') {
          if (claim.verification.verdict === 'TRUE') {
            color = 'bg-green-500/20 text-green-700 dark:text-green-300';
          } else if (claim.verification.verdict === 'FALSE') {
            color = 'bg-red-500/20 text-red-700 dark:text-red-300';
          }
        }

        const sentenceRegex = new RegExp(`[^.!?]*${cleanClaim}[^.!?]*[.!?]`, 'gi');
        highlightedContent = highlightedContent.replace(
          sentenceRegex,
          (match) => `<span class="px-1 rounded ${color}" title="${claim.verification.explanation}">${match}</span>`
        );
      });

      return {
        content: content,
        metadata: {
          total_claims: data.metadata.total_claims,
          successfully_verified: data.metadata.successfully_verified
        },
        verified_claims: data.verified_claims
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