import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { useClaimAnalysis } from "./useClaimAnalysis";
import { Button } from "./components/ui/button";
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Upload,
  Link,
  Download,
} from "lucide-react";
import { Card } from "./components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { generatePDF } from "./reportGenerator";

interface AnalysisResult {
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

const Editor: React.FC = () => {
  const [inputMethod, setInputMethod] = useState<"text" | "file" | "url">(
    "text"
  );
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const { isAnalyzing, analyzeContent } = useClaimAnalysis();
  const [expandedClaims, setExpandedClaims] = useState<Set<number>>(new Set());
  const [isUrlFetching, setIsUrlFetching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);


  const getClaimKey = (
    claim: { text: string; isTrue: boolean },
    index: number
  ) => {
    return `${claim.text}-${index}`;
  };

  const handleUrlFetch = async () => {
    if (!url) return;

    setIsUrlFetching(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setContent(data.content);
    } catch (error) {
      console.error("Error fetching URL:", error);
      // You might want to add error handling UI feedback here
    } finally {
      setIsUrlFetching(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
  
      try {
        const response = await fetch('http://127.0.0.1:8000/api/parse_doc', {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        setContent(data.content);
      } catch (error) {
        console.error('Error uploading PDF:', error);
        // You might want to add error handling UI feedback here
      } finally {
        setIsUploading(false);
      }
    }
  };
  const handleAnalyze = async () => {
    try {
      const result = await analyzeContent(content);
      setAnalysisResult(result);
    } catch (error) {
      console.error("Analysis failed:", error);
      // You might want to add error handling UI feedback here
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="text" onValueChange={(v) => setInputMethod(v as any)}>
        <TabsList>
          <TabsTrigger value="text">Paste Text</TabsTrigger>
          <TabsTrigger value="file">Upload Document</TabsTrigger>
          <TabsTrigger value="url">Enter URL</TabsTrigger>
        </TabsList>

        <TabsContent value="text">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your content here..."
            className="min-h-[200px]"
          />
        </TabsContent>

        <TabsContent value="file">
  <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
    <input
      type="file"
      ref={fileInputRef}
      onChange={handleFileUpload}
      accept=".doc,.docx,.pdf"
      className="hidden"
    />
    
    {selectedFile ? (
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <Upload className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{selectedFile.name}</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => {
            setSelectedFile(null);
            setContent('');
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }}
        >
          <XCircle className="h-4 w-4" />
        </Button>
      </div>
    ) : (
      <Button 
        onClick={() => fileInputRef.current?.click()} 
        disabled={isUploading}
        className="mx-auto"
      >
        {isUploading ? (
          <>
            <span className="animate-spin mr-2">⏳</span>
            Extracting text...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </>
        )}
      </Button>
    )}
    {content && (
      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          Document Uploaded and Text extracted successfully! You can now analyze it.
        </p>
      </div>
    )}
  </div>
        </TabsContent>

        <TabsContent value="url">
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL..."
                className="flex-1 p-2 border rounded"
              />
              <Button onClick={handleUrlFetch} disabled={!url || isUrlFetching}>
                {isUrlFetching ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Fetching...
                  </>
                ) : (
                  <>
                    <Link className="mr-2 h-4 w-4" />
                    Fetch
                  </>
                )}
              </Button>
            </div>
            {content && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Content fetched successfully! You can now analyze it.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Button
        onClick={handleAnalyze}
        disabled={!content && !url}
        className="w-full"
      >
        {isAnalyzing ? "Analyzing..." : "Analyze Content"}
      </Button>

      {analysisResult && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-foreground">
              Analysis Results
            </h3>
            <Button
              onClick={() => generatePDF(analysisResult)}
              variant="outline"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>

          <Card className="p-4 bg-card text-card-foreground">
            <div className="text-center mb-4">
              <h4 className="text-lg font-medium">Truth Value</h4>
              <div className="text-3xl font-bold text-primary">
                {analysisResult.truthValue}%
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* True Claims Section */}
              <div className="space-y-2">
                {analysisResult.claims
                  .filter((claim) => claim.isTrue)
                  .map((claim, index) => {
                    const claimKey = getClaimKey(claim, index);
                    const getHostname = (url: string) => {
                      try {
                        return new URL(url).hostname;
                      } catch {
                        return url;
                      }
                    };

                    return (
                      <div
                        key={claimKey}
                        className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 flex-shrink-0 mr-3" />
                            <p className="font-medium text-foreground">
                              {claim.text}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setExpandedClaims((prev) => {
                                const next = new Set(prev);
                                prev.has(index)
                                  ? next.delete(index)
                                  : next.add(index);
                                return next;
                              })
                            }
                            className="ml-2"
                          >
                            {expandedClaims.has(index)
                              ? "Hide Details"
                              : "Show Details"}
                          </Button>
                        </div>

                        {expandedClaims.has(index) && (
                          <div className="mt-3 pl-8 space-y-2">
                            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded">
                              <p className="text-sm text-muted-foreground">
                                {claim.explanation}
                              </p>
                            </div>
                            {claim.primarySource && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                  Primary Source:
                                </span>
                                <a
                                  href={claim.primarySource}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center gap-1 underline"
                                >
                                  {getHostname(claim.primarySource)}
                                  <Link className="h-3 w-3" />
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>

              {/* False Claims Section */}
              <div className="space-y-2">
                {analysisResult.claims
                  .filter((claim) => !claim.isTrue)
                  .map((claim, index) => {
                    const claimKey = getClaimKey(claim, index);
                    const getHostname = (url: string) => {
                      try {
                        return new URL(url).hostname;
                      } catch {
                        return url;
                      }
                    };
                    const falseClaimIndex =
                      analysisResult.claims.filter((c) => !c.isTrue).length +
                      index;
                    return (
                      <div
                        key={claimKey}
                        className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <XCircle className="h-5 w-5 text-red-500 dark:text-red-400 flex-shrink-0 mr-3" />
                            <p className="font-medium text-foreground">
                              {claim.text}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setExpandedClaims((prev) => {
                                const next = new Set(prev);
                                prev.has(falseClaimIndex)
                                  ? next.delete(falseClaimIndex)
                                  : next.add(falseClaimIndex);
                                return next;
                              })
                            }
                            className="ml-2"
                          >
                            {expandedClaims.has(falseClaimIndex)
                              ? "Hide Details"
                              : "Show Details"}
                          </Button>
                        </div>

                        {expandedClaims.has(falseClaimIndex) && (
                          <div className="mt-3 pl-8 space-y-2">
                            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded">
                              <p className="text-sm text-muted-foreground">
                                {claim.explanation}
                              </p>
                            </div>
                            {claim.primarySource && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                  Primary Source:
                                </span>
                                <a
                                  href={claim.primarySource}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center gap-1 underline"
                                >
                                  {getHostname(claim.primarySource)}

                                  <Link className="h-3 w-3" />
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default Editor;
