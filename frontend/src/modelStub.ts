interface AnalysisResult {
  highlightedText: string;
  claims: { text: string; isTrue: boolean }[];
}

export const analyzeContent = async (content: string): Promise<AnalysisResult> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Dummy implementation
  const claims = [
    { text: "The earth is flat.", isTrue: false },
    { text: "Water boils at 100 degrees Celsius at sea level.", isTrue: true },
    { text: "The moon is made of cheese.", isTrue: false },
  ];

  const highlightedText = content.replace(
    new RegExp(claims.map(claim => claim.text).join('|'), 'gi'),
    (match) => {
      const claim = claims.find(c => c.text.toLowerCase() === match.toLowerCase());
      const color = claim?.isTrue ? 'green' : 'red';
      return `<span style="background-color: ${color}; color: white;">${match}</span>`;
    }
  );

  return { highlightedText, claims };
};