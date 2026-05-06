import React, { useMemo, useState } from 'react';
import { generateMockData } from './data/mockData';
import { MetricCard } from './components/MetricCard';
import { CohortHeatmap } from './components/CohortHeatmap';
import { RetentionChart } from './components/RetentionChart';
import { SQLConsole } from './components/SQLConsole';
import { AIRecommendations } from './components/AIRecommendations';
import { UserProfile } from './components/UserProfile';
import { Database, Filter, Download, Calendar, BarChart3, Users } from 'lucide-react';
import { formatCurrency, formatPercent, downloadCSV } from './lib/utils';

export default function App() {
  const { cohorts, metrics, rawUsers } = useMemo(() => generateMockData(), []);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState('');

  const selectedUser = useMemo(() => 
    rawUsers.find(u => u.id === selectedUserId), 
  [rawUsers, selectedUserId]);

  const filteredUsers = useMemo(() => {
    const search = userSearch.toLowerCase();
    return rawUsers
      .filter(u => u.id.toLowerCase().includes(search))
      .slice(0, 5);
  }, [rawUsers, userSearch]);

  const handleExportCohorts = () => {
    const maxMonths = Math.max(...cohorts.map(c => c.retention.length));
    const headers = ['Cohort', 'Size', ...Array.from({ length: maxMonths }, (_, i) => `Month ${i}`)];
    const rows = cohorts.map(c => [
      c.cohortName,
      c.totalUsers,
      ...c.retention.map(r => (r * 100).toFixed(2) + '%')
    ]);
    downloadCSV('cohort_retention_analytics.csv', [headers, ...rows]);
  };

  const handleExportUsers = () => {
    const headers = ['User ID', 'Plan', 'Status', 'Signup Date', 'LTV'];
    const rows = rawUsers.map(u => [
      u.id,
      u.plan,
      u.status,
      u.signupDate,
      u.lifetimeValue
    ]);
    downloadCSV('recent_subscribers_audit.csv', [headers, ...rows]);
  };

  return (
    <div className="min-h-screen p-4 md:p-10 max-w-[1600px] mx-auto">
      <div className="border-[12px] border-editorial-black bg-editorial-bg p-6 md:p-10 min-h-[calc(100vh-5rem)] flex flex-col">
        {selectedUser ? (
          <UserProfile user={selectedUser} onBack={() => setSelectedUserId(null)} />
        ) : (
          <>
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-editorial-black pb-8 mb-10">
              <div className="flex flex-col">
                <span className="text-xs font-sans tracking-[0.2em] uppercase font-bold text-gray-500 mb-2">Analysis Vol. 22 // FY2024</span>
                <h1 className="text-6xl md:text-8xl font-black leading-none tracking-tighter uppercase">
                  RETENTION<br/>DYNAMICS
                </h1>
              </div>
              
              <div className="md:text-right max-w-sm space-y-4">
                <p className="text-sm italic leading-relaxed text-gray-700">
                  An examination of subscription decay and cohort behavior across the current fiscal cycle. Proprietary metrics derived from production read replicas.
                </p>
                <div className="flex gap-4 md:justify-end font-sans text-[10px] font-bold tracking-widest uppercase">
                  <button className="px-3 py-1.5 bg-editorial-black text-white hover:opacity-90 transition-all">SQL Engine</button>
                  <button className="px-3 py-1.5 border border-editorial-black hover:bg-editorial-black hover:text-white transition-all">Python v3.11</button>
                </div>
              </div>
            </header>

            {/* Main Analysis Area */}
            <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-10">
              
              {/* Left Column: Heatmap & Charts (8 Cols) */}
              <section className="md:col-span-8 space-y-10">
                <div className="flex justify-between items-baseline mb-4 border-b border-editorial-black/10 pb-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <h2 className="text-2xl font-bold italic tracking-tight">Cohort Decay Matrix</h2>
                  </div>
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={handleExportCohorts}
                      className="flex items-center gap-1.5 font-sans text-[10px] uppercase font-bold hover:underline transition-all cursor-pointer"
                    >
                      <Download size={12} /> Export CSV
                    </button>
                    <span className="font-sans text-[10px] uppercase tracking-widest opacity-60">Retention % by Month Since Join</span>
                  </div>
                </div>
                
                <CohortHeatmap data={cohorts} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-editorial-black/10 pb-2">
                      <BarChart3 size={16} />
                      <h3 className="text-xs font-sans font-black uppercase tracking-widest">Decay Velocity</h3>
                    </div>
                    <RetentionChart data={cohorts} />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-editorial-black/10 pb-2">
                      <Database size={16} />
                      <h3 className="text-xs font-sans font-black uppercase tracking-widest">Query Sandbox</h3>
                    </div>
                    <SQLConsole />
                  </div>
                </div>
              </section>

              {/* Right Column: Aside (4 Cols) */}
              <aside className="md:col-span-4 flex flex-col justify-between border-l border-editorial-black pl-0 md:pl-10">
                <div className="space-y-10">
                  {/* Metrics List */}
                  <section className="space-y-6">
                    <h3 className="text-xs font-sans font-black uppercase tracking-widest mb-4 border-b border-editorial-black pb-1">Key Metrics</h3>
                    <div className="space-y-6">
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm italic">Overall Churn</span>
                        <span className="text-4xl font-bold leading-none tracking-tight font-serif">{formatPercent(metrics.monthlyChurnRate)}</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm italic">Average LTV</span>
                        <span className="text-4xl font-bold leading-none tracking-tight font-serif">{formatCurrency(metrics.averageLTV)}</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm italic">Survival Rate</span>
                        <span className="text-4xl font-bold leading-none tracking-tight font-serif">71%</span>
                      </div>
                    </div>
                  </section>

                  <AIRecommendations data={cohorts} />

                  <section>
                    <div className="flex justify-between items-center mb-6 border-b border-editorial-black pb-1">
                      <h3 className="text-xs font-sans font-black uppercase tracking-widest">Recent Entities</h3>
                      <button 
                        onClick={handleExportUsers}
                        className="flex items-center gap-1 font-sans text-[9px] uppercase font-bold hover:underline opacity-60 hover:opacity-100 transition-all cursor-pointer h-4"
                      >
                        <Download size={10} /> Export
                      </button>
                    </div>

                    <div className="mb-6 relative group">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 text-editorial-black/30 group-focus-within:text-editorial-black transition-colors">
                        <Filter size={10} />
                      </div>
                      <input 
                        type="text"
                        placeholder="Filter by Entity ID..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="w-full bg-transparent border-b border-editorial-black/10 focus:border-editorial-black outline-none py-1 pl-5 text-[10px] font-mono uppercase placeholder:opacity-30 transition-all"
                      />
                    </div>

                    <div className="space-y-px">
                      <div className="grid grid-cols-[1fr_80px_60px] p-2 text-[8px] font-sans font-black uppercase opacity-30 tracking-widest">
                        <div>Entity ID</div>
                        <div className="text-right">Tier</div>
                        <div className="text-right">Status</div>
                      </div>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <div 
                            key={user.id} 
                            onClick={() => setSelectedUserId(user.id)}
                            className="data-row grid-cols-[1fr_80px_60px] p-2 text-[10px] font-mono uppercase"
                          >
                            <div className="truncate">{user.id}</div>
                            <div className="text-right opacity-60 italic">{user.plan}</div>
                            <div className={user.status === 'churned' ? 'text-red-600 text-right font-bold' : 'text-green-700 text-right font-bold'}>
                              {user.status}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-2 text-[10px] font-mono opacity-40 italic uppercase tracking-tighter">
                          // No matching entities found
                        </div>
                      )}
                    </div>
                  </section>
                </div>

                <div className="mt-12">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div>
                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest">Real-time Pipeline Active</span>
                  </div>
                  <footer className="text-[9px] font-sans leading-relaxed opacity-50 space-y-1">
                    <p>Report generated 2026-05-06 14:32:01. All values in INR.</p>
                    <p>Proprietary subscription data models // Build 4.2.0-STABLE</p>
                  </footer>
                </div>
              </aside>
            </main>
          </>
        )}
      </div>
    </div>
  );
}
