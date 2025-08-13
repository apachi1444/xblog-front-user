/**
 * Utility functions for subscription status handling and display
 */

export type SubscriptionStatus = 'active' | 'canceled' | 'cancelled' | 'past_due' | 'trialing' | 'incomplete' | 'unpaid' | string;

export interface StatusColors {
  background: string;
  border: string;
  text: string;
  dot: string;
}

/**
 * Get color scheme for subscription status
 */
export function getStatusColors(status: string): StatusColors {
  const normalizedStatus = status.toLowerCase();

  switch (normalizedStatus) {
    case 'active':
      return {
        background: 'rgba(34, 197, 94, 0.1)',
        border: 'rgba(34, 197, 94, 0.2)',
        text: '#16a34a',
        dot: '#22c55e'
      };

    case 'canceled':
    case 'cancelled':
      return {
        background: 'rgba(239, 68, 68, 0.1)',
        border: 'rgba(239, 68, 68, 0.2)',
        text: '#dc2626',
        dot: '#ef4444'
      };

    case 'past_due':
    case 'unpaid':
      return {
        background: 'rgba(245, 158, 11, 0.1)',
        border: 'rgba(245, 158, 11, 0.2)',
        text: '#d97706',
        dot: '#f59e0b'
      };

    case 'trialing':
      return {
        background: 'rgba(168, 85, 247, 0.1)',
        border: 'rgba(168, 85, 247, 0.2)',
        text: '#9333ea',
        dot: '#a855f7'
      };

    case 'incomplete':
    case 'incomplete_expired':
      return {
        background: 'rgba(156, 163, 175, 0.1)',
        border: 'rgba(156, 163, 175, 0.2)',
        text: '#6b7280',
        dot: '#9ca3af'
      };

    default:
      return {
        background: 'rgba(156, 163, 175, 0.1)',
        border: 'rgba(156, 163, 175, 0.2)',
        text: '#6b7280',
        dot: '#9ca3af'
      };
  }
}

/**
 * Format status text for display
 */
export function formatStatusText(status: string): string {
  return status
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Check if status indicates an active subscription
 */
export function isActiveStatus(status: string): boolean {
  const normalizedStatus = status.toLowerCase();
  return normalizedStatus === 'active' || normalizedStatus === 'trialing';
}

/**
 * Check if status indicates a problematic subscription
 */
export function isProblematicStatus(status: string): boolean {
  const normalizedStatus = status.toLowerCase();
  return ['canceled', 'cancelled', 'past_due', 'unpaid', 'incomplete', 'incomplete_expired'].includes(normalizedStatus);
}

/**
 * Get status priority for sorting (lower number = higher priority)
 */
export function getStatusPriority(status: string): number {
  const normalizedStatus = status.toLowerCase();
  
  switch (normalizedStatus) {
    case 'active': return 1;
    case 'trialing': return 2;
    case 'past_due': return 3;
    case 'unpaid': return 4;
    case 'incomplete': return 5;
    case 'canceled': 
    case 'cancelled': return 6;
    default: return 7;
  }
}

/**
 * Get user-friendly status description
 */
export function getStatusDescription(status: string): string {
  const normalizedStatus = status.toLowerCase();
  
  switch (normalizedStatus) {
    case 'active':
      return 'Your subscription is active and all features are available.';
    case 'trialing':
      return 'You are currently in a trial period.';
    case 'past_due':
      return 'Payment is past due. Please update your payment method.';
    case 'canceled':
    case 'cancelled':
      return 'Your subscription has been canceled.';
    case 'unpaid':
      return 'Payment failed. Please update your payment method.';
    case 'incomplete':
      return 'Subscription setup is incomplete.';
    case 'incomplete_expired':
      return 'Subscription setup expired. Please try again.';
    default:
      return 'Subscription status is unknown.';
  }
}
