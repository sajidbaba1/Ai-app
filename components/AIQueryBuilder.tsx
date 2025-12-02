import React, { useState } from 'react';
import { generateSqlFromQuestion } from '../services/geminiService';
import { dataService } from '../services/dataService';
import { Sparkles, Database, Terminal, Play, Loader2 } from 'lucide-react';
import { Student } from '../types';

interface AIQueryBuilderProps {
  onResults?: (results: Student[]) => void;
}

const AIQueryBuilder: React.FC<AIQueryBuilderProps> = () => {
  const [question, setQuestion] = useState('');
  const [sql, setSql] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setError('');
    try {
      const generatedSql = await generateSqlFromQuestion(question);
      setSql(generatedSql);
    } catch (e) {
      setError("Failed to generate SQL. Please check your API Key.");
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = async () => {
    if (!sql) return;
    setExecuting(true);
    try {
      // Logic to send this SQL to the (simulated) DB
      const data = await dataService.executeRawQuery(sql);
      setResults(data);
    } catch (e) {
      setError("Failed to execute query.");
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[500px]">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-2 mb-4 text-indigo-600">
            <Sparkles size={20} />
            <h3 className="font-bold">AI Query Generator</h3>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Ask questions about your data in plain English. Gemini will translate them into SQL.
          </p>
          <div className="space-y-3">
            <textarea
              className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-32"
              placeholder="e.g., Show me all Computer Science students with a GPA over 3.5"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !question}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              Generate SQL
            </button>
          </div>
        </div>

        {sql && (
          <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800 text-slate-300 font-mono text-sm relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-50 text-[10px] uppercase tracking-wider font-bold text-slate-500">
               PostgreSQL
            </div>
            <div className="flex items-center gap-2 mb-3 text-emerald-400">
              <Terminal size={16} />
              <span className="font-semibold">Generated Query</span>
            </div>
            <pre className="whitespace-pre-wrap break-all bg-slate-950/50 p-3 rounded border border-slate-800 text-emerald-300">
              {sql}
            </pre>
            <button
              onClick={handleExecute}
              disabled={executing}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded border border-slate-700 transition"
            >
              {executing ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} />}
              Run Query
            </button>
          </div>
        )}
         {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
      </div>

      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Database size={18} />
                <span>Query Results</span>
            </div>
            <span className="text-xs text-slate-400">
                {results.length} record(s) found
            </span>
        </div>
        
        <div className="flex-1 overflow-auto p-0">
          {results.length > 0 ? (
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase sticky top-0">
                    <tr>
                        {Object.keys(results[0]).map(key => (
                            <th key={key} className="px-6 py-3 border-b border-slate-100">{key.replace('_', ' ')}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {results.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                            {Object.values(row).map((val: any, j) => (
                                <td key={j} className="px-6 py-3 text-slate-700">
                                    {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 p-12">
                <Database size={48} className="mb-4 opacity-20" />
                <p>No results to display</p>
                <p className="text-xs mt-2 opacity-60">Generate and run a query to see data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIQueryBuilder;
