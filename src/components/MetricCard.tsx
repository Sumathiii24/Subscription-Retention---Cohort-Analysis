import React from 'react';
import { motion } from 'motion/react';
import { cn, formatCurrency, formatPercent } from '../lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  type: 'currency' | 'percent' | 'number';
  trend?: number;
  description?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, type, trend, description }) => {
  const formattedValue = type === 'currency' 
    ? formatCurrency(value as number) 
    : type === 'percent' 
      ? formatPercent(value as number) 
      : value;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 border border-editorial-black bg-white flex flex-col justify-between"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-500">
          // {label}
        </span>
        {trend !== undefined && (
          <div className={cn(
            "flex items-center text-[10px] font-mono font-bold",
            trend > 0 ? "text-green-700" : "text-red-600"
          )}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      
      <div className="text-4xl font-serif font-black tracking-tight text-editorial-black">
        {formattedValue}
      </div>
      
      {description && (
        <p className="mt-2 text-[10px] text-gray-400 font-sans uppercase tracking-tighter italic">
          {description}
        </p>
      )}
    </motion.div>
  );
};
