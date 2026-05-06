import React, { useEffect, useState } from 'react';
import { CohortRow, InsightReport } from '../types';
import { analyzeRetention } from '../services/geminiService';
import { Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface AIRecommendationsProps {
  data: CohortRow[];
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({ data }) => {
  const [insights, setInsights] = useState<InsightReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      const res = await analyzeRetention(data);
      setInsights(res);
      setLoading(false);
    };
    fetchInsights();
  }, [data]);

  return (
    <div className="border border-editorial-black bg-white p-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={16} className="text-gray-400" />
        <h2 className="text-xs font-sans font-black uppercase tracking-widest border-b border-editorial-black pb-1">
          Analytical Observations
        </h2>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-6 gap-3 opacity-50">
          <Loader2 className="animate-spin text-editorial-black" size={20} />
          <p className="font-mono text-[9px] uppercase tracking-widest italic">// Analysis in Progress...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {insights.map((insight, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="space-y-2 border-b border-editorial-black/10 pb-4 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-2">
                 <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    insight.impact === 'High' ? 'bg-red-600' : 'bg-editorial-black'
                  )} />
                  <h4 className="text-[10px] font-black uppercase tracking-tight font-sans">
                    {insight.title}
                  </h4>
              </div>
              <p className="text-xs text-gray-700 italic leading-snug">
                {insight.observation}
              </p>
              <p className="text-[11px] font-medium border-l-2 border-editorial-black pl-3 py-0.5">
                {insight.recommendation}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
