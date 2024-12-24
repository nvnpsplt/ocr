import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { PhotoIcon, ClockIcon, ExclamationCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { processImageWithRetry } from './services/ollamaService';

function App() {
  const [currentResult, setCurrentResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState('');
  const [processingSteps, setProcessingSteps] = useState({ current: '', steps: [] });

  const processImage = async (file) => {
    setLoading(true);
    setError(null);
    setProcessingSteps({
      current: 'Preparing image',
      steps: ['Preparing image', 'Analyzing invoice', 'Extracting data', 'Formatting results']
    });

    try {
      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
      reader.readAsDataURL(file);
      
      setProcessingSteps(prev => ({ ...prev, current: 'Analyzing invoice' }));
      const base64Image = await base64Promise;
      
      setProcessingSteps(prev => ({ ...prev, current: 'Extracting data' }));
      const text = await processImageWithRetry(base64Image, (progress) => {
        setProgress(progress);
      });
      
      setProcessingSteps(prev => ({ ...prev, current: 'Formatting results' }));
      const result = {
        id: Date.now(),
        extractedData: text,
        timestamp: new Date().toLocaleString(),
        image: URL.createObjectURL(file),
        filename: file.name
      };

      setCurrentResult(result);
      setHistory(prev => [result, ...prev]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setProgress('');
      setProcessingSteps({ current: '', steps: [] });
    }
  };

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    await processImage(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: false
  });

  const ResultDisplay = ({ result }) => {
    if (!result) return null;

    const tableHeaders = [
      'Invoice number', 'Invoice Date', 'Invoice Amount', 'Currency',
      'Legal Entity Name', 'Legal Entity Address', 'Vendor Name', 'Vendor Address',
      'Payment Terms', 'Payment Method', 'VAT ID', 'GL Account Number', 'Bank Account Number'
    ];

    return (
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-[1px] rounded-xl mt-8">
        <div className="bg-gray-900/70 backdrop-blur-md rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-200 mb-6">Extracted Information</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-base">
              <tbody>
                {tableHeaders.map(header => (
                  <tr key={header}>
                    <th className="bg-blue-900/30 text-left p-4 border border-blue-500/20 font-medium text-gray-200 w-1/3">
                      {header}
                    </th>
                    <td className="p-4 border border-blue-500/20 text-gray-300">
                      {result.extractedData[header] || 'not available'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-8">
          Invoice OCR Extractor
        </h1>

        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-[1px] rounded-xl">
            <div 
              {...getRootProps()} 
              className={`
                bg-gray-900/70 backdrop-blur-md rounded-xl p-8 text-center
                transition-all duration-200 ease-in-out
                ${isDragActive ? 'scale-[1.02] bg-gray-900/80' : 'hover:bg-gray-900/80'}
              `}
            >
              <input {...getInputProps()} />
              <div className="text-center">
                <PhotoIcon className="mx-auto h-12 w-12 text-blue-400" />
                <p className="mt-4 text-lg text-gray-200">
                  {isDragActive 
                    ? "Drop the invoice here..." 
                    : "Drag and drop an invoice, or click to select"
                  }
                </p>
              </div>
            </div>
          </div>

          {loading && (
            <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-blue-500/20">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <ClockIcon className="h-5 w-5 text-blue-400 animate-spin" />
                <p className="text-gray-300">{processingSteps.current}</p>
              </div>
              <div className="space-y-2">
                {processingSteps.steps.map((step, index) => (
                  <div 
                    key={step}
                    className="flex items-center space-x-2"
                  >
                    <div 
                      className={`h-2 w-2 rounded-full ${
                        step === processingSteps.current
                          ? 'bg-blue-400 animate-pulse'
                          : index < processingSteps.steps.indexOf(processingSteps.current)
                            ? 'bg-blue-500'
                            : 'bg-gray-600'
                      }`}
                    />
                    <p className={`text-sm ${
                      step === processingSteps.current
                        ? 'text-gray-200'
                        : index < processingSteps.steps.indexOf(processingSteps.current)
                          ? 'text-gray-400'
                          : 'text-gray-500'
                    }`}>
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-900/20 rounded-lg border border-red-500/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                  <p className="text-red-400">{error}</p>
                </div>
                <button
                  onClick={() => processImage(currentResult?.image)}
                  className="flex items-center space-x-1 px-3 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                >
                  <ArrowPathIcon className="h-4 w-4" />
                  <span>Retry</span>
                </button>
              </div>
            </div>
          )}

          {currentResult && <ResultDisplay result={currentResult} />}

          {history.length > 0 && (
            <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-500 p-[1px] rounded-xl">
              <div className="bg-gray-900/70 backdrop-blur-md rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-200 mb-4">History</h2>
                <div className="space-y-4">
                  {history.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-gray-900/50 backdrop-blur-md rounded-lg p-4 hover:bg-gray-900/60 transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-gray-200">{item.filename}</h4>
                          <p className="text-sm text-gray-400">{item.timestamp}</p>
                        </div>
                        <button 
                          onClick={() => setCurrentResult(item)}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
