import { useState } from 'react';
import { ReportApi } from '../lib/api';
import type { GenerateReportFromFileParams } from '../types/reportAI';

export function useReportGeneration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);

  const generateReport = async (params: GenerateReportFromFileParams) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Starting report generation with params:', params);
      
      const result = await ReportApi.generateReportFromFile(params);
      console.log('Report generation result:', result);
      console.log('Result type:', typeof result);
      console.log('Result length:', result?.length);
      
      setGeneratedReport(result);
      return result;
    } catch (err) {
      console.error('Report generation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate report';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetReport = () => {
    setGeneratedReport(null);
    setError(null);
  };

  const downloadReport = (filename: string = 'report.html') => {
    if (!generatedReport) return;
    
    const blob = new Blob([generatedReport], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return {
    loading,
    error,
    generatedReport,
    generateReport,
    resetReport,
    downloadReport
  };
}