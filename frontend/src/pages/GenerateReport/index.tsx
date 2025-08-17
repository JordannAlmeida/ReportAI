import React, { useState, useRef } from 'react';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { useReportGeneration } from '../../hooks/useReportGeneration';

interface GenerateFormData {
  idReport: string;
  prompt: string;
  model: string;
  file: File | null;
}

export default function GenerateReport() {
  const { loading, error, generatedReport, generateReport, resetReport, downloadReport } = useReportGeneration();
  const [formData, setFormData] = useState<GenerateFormData>({
    idReport: '',
    prompt: '',
    model: '',
    file: null
  });
  const [dragActive, setDragActive] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setTimeout(() => setIsFormVisible(true), 100);
  }, []);

  const acceptedTypes = ['application/pdf', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  const acceptedExtensions = ['.pdf', '.csv', '.xls', '.xlsx'];

  const validateFile = (file: File): boolean => {
    return acceptedTypes.includes(file.type) || acceptedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
  };

  const handleFileSelect = (file: File) => {
    if (!validateFile(file)) {
      alert('Please select a valid file: PDF, CSV, or Excel (.xls, .xlsx)');
      return;
    }
    setFormData(prev => ({ ...prev, file }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) {
      return;
    }
    
    if (!formData.idReport || !formData.file) {
      alert('Please provide Report ID and select a file');
      return;
    }

    try {
      await generateReport({
        idReport: parseInt(formData.idReport),
        prompt: formData.prompt || undefined,
        model: formData.model || undefined,
        file: formData.file
      });
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleNewGeneration = () => {
    resetReport();
    setFormData({
      idReport: '',
      prompt: '',
      model: '',
      file: null
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (generatedReport) {
    console.log("The report has been generated successfully.");
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Generated Report</h1>
            <p className="text-gray-600">Your report has been successfully generated</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Button 
                onClick={() => downloadReport()}
                className="hover:shadow-md transition-shadow duration-200"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v4m0 0l-3-3m3 3l3-3M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Download Report
              </Button>
              <Button 
                variant="outline" 
                onClick={handleNewGeneration}
                className="hover:shadow-md transition-shadow duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Generate New Report
              </Button>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Report Preview</h3>
              </div>
              <div className="p-4 bg-white max-h-96 overflow-auto">
                <div dangerouslySetInnerHTML={{ __html: generatedReport }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div 
          className="mb-8 opacity-0"
          style={{ 
            animation: isFormVisible ? 'slideInDown 0.6s ease-out forwards' : 'none'
          }}
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">Generate Report</h1>
          <p className="text-gray-600">Upload a file and generate an AI-powered report</p>
        </div>

        {error && (
          <div 
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 opacity-0 animate-shake"
            style={{ animation: 'slideInLeft 0.5s ease-out forwards, shake 0.5s ease-in-out 0.5s' }}
          >
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        <div 
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 opacity-0 transform transition-all duration-500 hover:shadow-lg"
          style={{ 
            animation: isFormVisible ? 'slideInUp 0.6s ease-out 0.2s forwards' : 'none'
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-0"
              style={{ 
                animation: isFormVisible ? 'fadeInUp 0.6s ease-out 0.4s forwards' : 'none'
              }}
            >
              <div className="transform hover:scale-105 transition-all duration-200">
                <Input
                  label="Report ID"
                  type="number"
                  placeholder="Enter template ID"
                  value={formData.idReport}
                  onChange={(e) => setFormData(prev => ({ ...prev, idReport: e.target.value }))}
                  required
                />
              </div>
              <div className="transform hover:scale-105 transition-all duration-200">
                <Input
                  label="Model (Optional)"
                  type="text"
                  placeholder="e.g., gpt-4, gemini-pro"
                  value={formData.model}
                  onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                />
              </div>
            </div>

            <div 
              className="opacity-0 transform hover:scale-105 transition-all duration-200"
              style={{ 
                animation: isFormVisible ? 'fadeInUp 0.6s ease-out 0.6s forwards' : 'none'
              }}
            >
              <Textarea
                label="Additional Prompt (Optional)"
                placeholder="Add any specific instructions or context for the report generation..."
                value={formData.prompt}
                onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
                rows={4}
              />
            </div>

            <div 
              className="opacity-0"
              style={{ 
                animation: isFormVisible ? 'fadeInUp 0.6s ease-out 0.8s forwards' : 'none'
              }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload File <span className="text-red-500">*</span>
              </label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 transform hover:scale-105 ${
                  dragActive 
                    ? 'border-orange bg-orange-50 scale-105 shadow-lg' 
                    : 'border-gray-300 hover:border-gray-400 hover:shadow-md'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.csv,.xls,.xlsx"
                  onChange={handleFileInputChange}
                />
                
                {formData.file ? (
                  <div className="space-y-2 animate-fadeIn">
                    <svg 
                      className="mx-auto h-12 w-12 text-green" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-900">{formData.file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(formData.file.size)}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, file: null }))}
                      className="transform hover:scale-110 transition-all duration-200"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <svg 
                      className={`mx-auto h-12 w-12 text-gray-400 transition-all duration-300 ${
                        dragActive ? 'scale-110' : 'hover:scale-110'
                      }`} 
                      stroke="currentColor" 
                      fill="none" 
                      viewBox="0 0 48 48"
                    >
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-sm text-gray-600">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="transform hover:scale-105 transition-all duration-200"
                      >
                        Choose file
                      </Button>
                      <span className="ml-2">or drag and drop</span>
                    </p>
                    <p className="text-xs text-gray-500">PDF, CSV, Excel files up to 10MB</p>
                  </div>
                )}
              </div>
            </div>

            <div 
              className="flex justify-end opacity-0"
              style={{ 
                animation: isFormVisible ? 'fadeInUp 0.6s ease-out 1s forwards' : 'none'
              }}
            >
              <Button 
                type="submit" 
                isLoading={loading} 
                disabled={!formData.idReport || !formData.file || loading}
                className="transform hover:scale-105 transition-all duration-200 disabled:hover:scale-100"
              >
                {loading ? 'Generating Report...' : 'Generate Report'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Custom Keyframe Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideInDown {
            from {
              opacity: 0;
              transform: translateY(-30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          @keyframes shake {
            0%, 100% {
              transform: translateX(0);
            }
            10%, 30%, 50%, 70%, 90% {
              transform: translateX(-5px);
            }
            20%, 40%, 60%, 80% {
              transform: translateX(5px);
            }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-in-out forwards;
          }
        `
      }} />
    </div>
  );
}