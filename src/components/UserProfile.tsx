import React, { useState } from 'react';
import { SubscriptionUser, SubscriptionEvent } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, User, Calendar, CreditCard, Activity, ShieldCheck, AlertTriangle, Info, Filter, TrendingUp } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, Tooltip } from 'recharts';

interface UserProfileProps {
  user: SubscriptionUser;
  onBack: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onBack }) => {
  const [activeFilter, setActiveFilter] = useState<SubscriptionEvent['type'] | 'all'>('all');

  const alerts = user.alerts || [];

  const filteredHistory = user.history?.filter(event => 
    activeFilter === 'all' || event.type === activeFilter
  ) || [];

  const filterOptions: (SubscriptionEvent['type'] | 'all')[] = ['all', 'signup', 'upgrade', 'downgrade', 'renewal', 'churn'];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <header className="flex items-center justify-between border-b border-editorial-black pb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 border border-editorial-black hover:bg-editorial-black hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-4xl font-black tracking-tighter uppercase">{user.id}</h2>
            <p className="text-[10px] font-sans font-black uppercase tracking-widest opacity-50">User Profile Audit // Entity_001</p>
          </div>
        </div>
        
        <div className={cn(
          "px-4 py-2 border-2 font-sans font-black uppercase tracking-widest text-xs",
          user.status === 'active' ? "border-green-600 text-green-700" : "border-red-600 text-red-600"
        )}>
          {user.status}
        </div>
      </header>

      <AnimatePresence mode="popLayout">
        {alerts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-editorial-black/10 pb-1">
              <AlertTriangle size={14} className="opacity-50" />
              <h3 className="text-[10px] font-sans font-black uppercase tracking-[0.2em] opacity-50">System Alerts // Active Notifications</h3>
            </div>
            
            <div className="space-y-2">
              {alerts.map((alert) => (
                <motion.div 
                  key={alert.id}
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className={cn(
                    "p-4 border-l-4 font-sans overflow-hidden transition-colors",
                    alert.type === 'critical' ? "bg-red-50 border-red-600 text-red-900" : 
                    alert.type === 'warning' ? "bg-amber-50 border-amber-500 text-amber-900" : 
                    "bg-blue-50 border-blue-600 text-blue-900"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {alert.type === 'critical' && <AlertTriangle size={18} className="text-red-600" />}
                      {alert.type === 'warning' && <AlertTriangle size={18} className="text-amber-600" />}
                      {alert.type === 'info' && <Info size={18} className="text-blue-600" />}
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-widest leading-none mb-1">{alert.title}</h3>
                        <p className="text-xs font-mono italic opacity-80">{alert.message}</p>
                      </div>
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-40">{alert.timestamp}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Stats Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="border border-editorial-black p-6 bg-white space-y-6">
            <div className="flex items-center gap-2 border-b border-editorial-black pb-2">
              <User size={16} />
              <h3 className="text-xs font-sans font-black uppercase tracking-widest">Subscriber Details</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-xs italic opacity-60">Plan Tier</span>
                <span className="text-lg font-bold uppercase">{user.plan}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs italic opacity-60">Signup Date</span>
                <span className="text-sm font-mono font-bold">{user.signupDate}</span>
              </div>
              <div className="flex justify-between items-baseline border-t border-editorial-black/10 pt-4">
                <span className="text-xs italic opacity-60">Lifetime Value</span>
                <span className="text-2xl font-black font-serif">{formatCurrency(user.lifetimeValue)}</span>
              </div>

              {user.ltvHistory && (
                <div className="pt-2 space-y-2">
                  <div className="flex items-center gap-1.5 opacity-40">
                    <TrendingUp size={10} />
                    <span className="text-[9px] font-black uppercase tracking-widest">LTV Evolution</span>
                  </div>
                  <div className="h-[60px] w-full border border-editorial-black/5 p-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={user.ltvHistory}>
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#141414" 
                          strokeWidth={2} 
                          dot={false}
                          animationDuration={1500}
                        />
                        <XAxis dataKey="month" hide />
                        <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border border-editorial-black p-4 bg-editorial-black text-white space-y-2">
            <div className="flex items-center gap-2 opacity-60">
              <ShieldCheck size={14} />
              <span className="text-[9px] uppercase font-bold tracking-widest">Compliance Status</span>
            </div>
            <p className="text-[10px] font-mono leading-tight">Entity verified against KYC protocol. No outstanding billing disputes flagged for current billing cycle.</p>
          </div>
        </div>

        {/* History Timeline */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-editorial-black/20 pb-2">
            <div className="flex items-center gap-2 h-6">
              <Activity size={16} />
              <h3 className="text-xs font-sans font-black uppercase tracking-widest translate-y-px">Subscription Ledger</h3>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 mr-2 opacity-30">
                <Filter size={10} />
                <span className="text-[8px] font-black uppercase tracking-widest">Filter</span>
              </div>
              {filterOptions.map(opt => (
                <button
                  key={opt}
                  onClick={() => setActiveFilter(opt)}
                  className={cn(
                    "text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 border transition-all cursor-pointer h-5 flex items-center",
                    activeFilter === opt 
                      ? "bg-editorial-black text-white border-editorial-black" 
                      : "border-editorial-black/20 hover:border-editorial-black/60 text-editorial-black"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          
          <div className="relative pl-8 space-y-8 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-editorial-black/10">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((event, i) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={i} 
                  className="relative"
                >
                  <div className="absolute -left-[22px] top-1 w-4 h-4 rounded-full border-2 border-editorial-black bg-white flex items-center justify-center">
                    <div className="w-1 h-1 bg-editorial-black rounded-full" />
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="pt-0.5">
                      <h4 className="text-[10px] font-black uppercase tracking-tight mb-1">{event.type}</h4>
                      <p className="text-sm italic text-gray-700 font-serif leading-none">{event.details}</p>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-editorial-gray px-2 py-1 uppercase">{event.date}</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-sm italic opacity-50 pl-2">// No events matching selected filter</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
