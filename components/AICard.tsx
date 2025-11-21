import React, { useEffect, useState } from 'react';
import { Occupation } from '../types';
import { getOccupationInsights } from '../services/geminiService';
import { Sparkles, Lightbulb, AlertCircle } from 'lucide-react';

interface AICardProps {
  occupation: Occupation;
}

export const AICard: React.FC<AICardProps> = ({ occupation }) => {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<{ summary: string; advice: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchInsights = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getOccupationInsights(occupation);
        if (isMounted) {
          setInsights(data);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load AI insights.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchInsights();

    return () => {
      isMounted = false;
    };
  }, [occupation]);

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-bold text-indigo-900">AI Migration Analysis</h3>
        <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full ml-auto">
          Gemini Powered
        </span>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-indigo-200 rounded w-3/4"></div>
          <div className="h-4 bg-indigo-200 rounded w-full"></div>
          <div className="h-4 bg-indigo-200 rounded w-5/6"></div>
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4"/>
            {error}
        </div>
      ) : insights ? (
        <div className="space-y-5">
          <div className="text-slate-700 text-sm leading-relaxed">
            {insights.summary}
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1">
               <Lightbulb className="w-3 h-3" />
               Improvement Strategy
            </h4>
            <ul className="space-y-2">
              {insights.advice.map((tip, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-white border border-indigo-200 text-indigo-600 rounded-full text-xs font-bold">
                    {index + 1}
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
};