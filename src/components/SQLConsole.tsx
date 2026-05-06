import React, { useState } from 'react';
import { Terminal, Database } from 'lucide-react';
import { motion } from 'motion/react';

export const SQLConsole: React.FC = () => {
  const [query, setQuery] = useState('SELECT cohort_month, retention_rate FROM subscription_logs WHERE year = 2023 GROUP BY 1;');
  
  return (
    <div className="border border-editorial-black bg-editorial-black text-white p-4 font-mono text-[10px]">
      <div className="flex items-center justify-between mb-3 border-b border-white/20 pb-2">
        <div className="flex items-center gap-2 opacity-70">
          <Database size={12} />
          <span className="uppercase tracking-tighter font-bold">SQL CONSOLE // READ_ONLY</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />
          <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex gap-2 items-start text-white">
            <span className="opacity-40">&gt;</span>
            <input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent border-none outline-none flex-1 text-white font-mono"
            />
          </div>
        </div>

        <div className="mt-4 opacity-40 space-y-1 text-[9px] uppercase tracking-widest leading-tight">
          <p>Querying Postgres [production_replica]...</p>
          <p>Scanned 12.4M records in 42ms.</p>
        </div>

        <div className="grid grid-cols-3 gap-2 py-2 border-t border-white/10 opacity-80 uppercase font-bold">
          <div className="border-r border-white/10 pr-2">COHORT</div>
          <div className="border-r border-white/10 pr-2 text-center">MONTH</div>
          <div className="text-right">RET_RATE</div>
          
          <div className="opacity-40">202301</div>
          <div className="text-center opacity-40">M0</div>
          <div className="text-right opacity-40">1.000</div>
          
          <div className="opacity-40">202301</div>
          <div className="text-center opacity-40">M1</div>
          <div className="text-right opacity-40">0.824</div>
        </div>
      </div>
    </div>
  );
};
