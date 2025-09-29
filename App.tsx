
import React, { useState, useCallback } from 'react';
import { ChartType, DataKey } from './types';
import { CHART_TYPES } from './constants';
import { generateChartData } from './services/geminiService';
import ChartDisplay from './components/ChartDisplay';
import TopicInput from './components/TopicInput';
import ChartTypeSelector from './components/ChartTypeSelector';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [chartType, setChartType] = useState<ChartType>(ChartType.BAR);
  const [chartData, setChartData] = useState<any[] | null>(null);
  const [dataKeys, setDataKeys] = useState<DataKey[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateChart = useCallback(async () => {
    if (!topic) {
      setError('Please enter a topic for the chart.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setChartData(null);
    setDataKeys(null);

    try {
      const result = await generateChartData(topic, chartType);
      if (result && result.data) {
        setChartData(result.data);
        setDataKeys(result.keys || null);
      } else {
        throw new Error('Received invalid data structure from AI.');
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate chart. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [topic, chartType]);

  const ChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-sky-400" viewBox="0 0 20 20" fill="currentColor">
      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-2">
            <ChartIcon />
            <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">
              AI Chart Generator
            </h1>
          </div>
          <p className="text-slate-400 text-lg">
            Turn any topic into a beautiful chart with the power of Gemini.
          </p>
        </header>

        <main>
          <div className="bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <TopicInput value={topic} onChange={setTopic} />
              <ChartTypeSelector
                chartTypes={CHART_TYPES}
                selectedType={chartType}
                onSelectType={setChartType}
              />
            </div>
            <button
              onClick={handleGenerateChart}
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  Generating...
                </>
              ) : (
                'Generate Chart'
              )}
            </button>
          </div>

          <div className="mt-8 bg-slate-800 p-4 sm:p-8 rounded-2xl shadow-lg border border-slate-700 min-h-[500px] flex items-center justify-center">
            {isLoading && (
              <div className="text-center">
                 <LoadingSpinner large={true}/>
                 <p className="mt-4 text-slate-400 text-lg">AI is visualizing your data...</p>
              </div>
            )}
            {error && <ErrorMessage message={error} />}
            {!isLoading && !error && chartData && (
              <ChartDisplay chartType={chartType} data={chartData} keys={dataKeys} />
            )}
            {!isLoading && !error && !chartData && (
              <div className="text-center text-slate-500">
                 <ChartIcon />
                <h3 className="text-2xl font-semibold mt-4">Your Chart Awaits</h3>
                <p>Enter a topic, select a chart type, and click "Generate Chart" to begin.</p>
              </div>
            )}
          </div>
        </main>
         <footer className="text-center text-slate-600 mt-8">
            <p>Powered by Google Gemini & React</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
