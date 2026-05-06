import { CohortRow, RetentionMetrics, SubscriptionUser } from '../types';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const generateMockData = (): { 
  cohorts: CohortRow[], 
  metrics: RetentionMetrics,
  rawUsers: SubscriptionUser[] 
} => {
  const cohorts: CohortRow[] = [];
  const rawUsers: SubscriptionUser[] = [];
  
  // Generate 12 months of cohorts
  for (let i = 0; i < 12; i++) {
    const monthName = `${MONTHS[i]} 2023`;
    const totalUsers = Math.floor(Math.random() * 500) + 500;
    
    // Retention decay simulation
    const retention: number[] = [1]; // Month 0 is always 100%
    let currentRetention = 1;
    
    for (let j = 1; j < 12 - i; j++) {
      // Retention usually drops fast in month 1-3, then stabilizes
      const drop = j <= 3 ? Math.random() * 0.15 + 0.05 : Math.random() * 0.05;
      currentRetention = Math.max(0, currentRetention - drop);
      retention.push(currentRetention);
    }
    
    cohorts.push({
      cohortName: monthName,
      totalUsers,
      retention
    });
    
    // Mock some raw users for detail views
    for (let u = 0; u < 10; u++) {
      const signupDate = `2023-${String(i + 1).padStart(2, '0')}-01`;
      const isChurned = Math.random() > 0.8;
      const plan = Math.random() > 0.7 ? 'Pro' : (Math.random() > 0.4 ? 'Basic' : 'Enterprise');
      
      const history: SubscriptionUser['history'] = [
        { date: signupDate, type: 'signup', details: `Initial signup for ${plan} plan` }
      ];

      if (isChurned) {
        history.push({ date: '2023-12-15', type: 'churn', details: 'Subscription cancelled by user' });
      } else if (Math.random() > 0.5) {
        history.push({ date: '2023-06-01', type: 'renewal', details: 'Auto-renewal successful' });
      }

      const ltvHistory = [];
      let currentLtv = 0;
      for (let m = 0; m < 6; m++) {
        currentLtv += Math.floor(Math.random() * 100) + 50;
        ltvHistory.push({
          month: `M${m + 1}`,
          value: currentLtv
        });
      }

      const billingHealth: SubscriptionUser['billingHealth'] = isChurned ? 'failed' : (Math.random() > 0.8 ? 'at_risk' : 'good');
      const alerts: SubscriptionUser['alerts'] = [];
      if (isChurned) {
        alerts.push({
          id: 'alt-01',
          type: 'critical',
          title: 'SUBSCRIPTION TERMINATED',
          message: 'Entity has completed the churn cycle. Final billing attempt failed.',
          timestamp: '2023-12-16'
        });
      } else if (billingHealth === 'at_risk') {
        alerts.push({
          id: 'alt-02',
          type: 'warning',
          title: 'Dunning risk detected',
          message: 'Multiple payment failures in the last 48 hours. Risk score: 0.89.',
          timestamp: '2024-05-01'
        });
      } else if (Math.random() > 0.7) {
        alerts.push({
          id: 'alt-03',
          type: 'info',
          title: 'loyalty program eligible',
          message: 'User has maintained active status for 6+ months. Tier-2 rewards unlocked.',
          timestamp: '2024-05-05'
        });
      }

      rawUsers.push({
        id: `user-${i}-${u}`,
        signupDate,
        plan,
        status: isChurned ? 'churned' : 'active',
        lifetimeValue: currentLtv,
        history,
        ltvHistory,
        billingHealth,
        alerts
      });
    }
  }

  const metrics: RetentionMetrics = {
    totalSubscribers: 12450,
    averageLTV: 842,
    monthlyChurnRate: 0.042,
    arpu: 45,
  };

  return { cohorts, metrics, rawUsers };
};
