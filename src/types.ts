/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SubscriptionEvent {
  date: string;
  type: 'signup' | 'upgrade' | 'downgrade' | 'churn' | 'renewal';
  details: string;
}

export interface UserAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
}

export interface SubscriptionUser {
  id: string;
  signupDate: string;
  plan: string;
  status: 'active' | 'churned';
  churnDate?: string;
  lifetimeValue: number;
  history?: SubscriptionEvent[];
  ltvHistory?: { month: string; value: number }[];
  billingHealth?: 'good' | 'at_risk' | 'failed';
  alerts?: UserAlert[];
}

export interface CohortRow {
  cohortName: string; // e.g., "2023-01"
  totalUsers: number;
  retention: number[]; // Array of percentages for Month 0, 1, 2...
}

export interface RetentionMetrics {
  totalSubscribers: number;
  averageLTV: number;
  monthlyChurnRate: number;
  arpu: number;
}

export interface InsightReport {
  title: string;
  observation: string;
  recommendation: string;
  impact: 'High' | 'Medium' | 'Low';
}
