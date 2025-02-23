export interface User {
  id: string;
  email: string;
}

export interface Claim {
  text: string;
  isTrue: boolean;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  claims: Claim[];
  accuracy: number;
}

export interface AnalysisResult {
  // Define the properties of AnalysisResult here
}