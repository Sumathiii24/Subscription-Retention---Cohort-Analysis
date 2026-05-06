import React from 'react';
import { CohortRow } from '../types';

interface CohortHeatmapProps {
  data: CohortRow[];
}

export const CohortHeatmap: React.FC<CohortHeatmapProps> = ({ data }) => {
  const getColor = (value: number) => {
    // High contrast scale for editorial feel
    // 100% -> Black/Dark Gray, 0% -> Light Gray
    if (value >= 0.9) return '#141414';
    if (value >= 0.75) return '#2a2a2a';
    if (value >= 0.6) return '#4d4d4d';
    if (value >= 0.45) return '#7a7a7a';
    if (value >= 0.3) return '#999999';
    if (value >= 0.15) return '#cccccc';
    return '#eeeeee';
  };

  const maxMonths = Math.max(...data.map(d => d.retention.length));

  return (
    <div className="overflow-x-auto border-t border-l border-editorial-black">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-editorial-black text-white h-10">
            <th className="px-3 text-left border-r border-white/20 font-sans font-bold text-[9px] uppercase tracking-tighter">Cohort</th>
            <th className="px-3 text-center border-r border-white/20 font-sans font-bold text-[9px] uppercase tracking-tighter">Size</th>
            {Array.from({ length: maxMonths }).map((_, i) => (
              <th key={i} className="px-3 text-center border-r border-white/20 font-sans font-bold text-[9px] uppercase tracking-tighter last:border-r-0">
                M{i}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="font-mono text-[10px]">
          {data.map((row, idx) => (
            <tr key={idx} className="border-b border-editorial-black group hover:bg-editorial-gray transition-colors">
              <td className="px-3 py-2 border-r border-editorial-black font-bold bg-editorial-gray/50">
                {row.cohortName}
              </td>
              <td className="px-3 py-2 text-center border-r border-editorial-black">
                {row.totalUsers.toLocaleString()}
              </td>
              {Array.from({ length: maxMonths }).map((_, mIdx) => {
                const value = row.retention[mIdx];
                if (value === undefined) return <td key={mIdx} className="border-r border-editorial-black last:border-r-0 bg-transparent"></td>;
                
                const bgColor = getColor(value);
                const textColor = value > 0.4 ? 'white' : 'black';
                
                return (
                  <td 
                    key={mIdx} 
                    className="p-1 text-center border-r border-editorial-black last:border-r-0"
                    style={{
                      backgroundColor: bgColor,
                      color: textColor
                    }}
                  >
                    <span className="font-bold">{Math.round(value * 100)}%</span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
