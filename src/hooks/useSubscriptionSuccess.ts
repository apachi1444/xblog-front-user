import type { SubscriptionPlan } from 'src/services/apis/subscriptionApi';

import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useGetSubscriptionPlansQuery } from 'src/services/apis/subscriptionApi';

interface SubscriptionSuccessData {
  subscriptionId: string;
  subscriptionCustomer: string;
  redirectStatus: string;
  plan?: SubscriptionPlan;
}

/**
 * Hook to detect subscription success from URL parameters and show success animation
 * Detects URLs like: https://web.vercel.app/?subscriptionId=681c8b8342&subscriptionCustomer=684e0d7c382e58cc&redirect_status=succeeded
 *
 * Note: The subscriptionId in the URL is the same as the planId, so we can directly match it
 * with the plans already cached in Redux store without making additional API calls.
 */
export function useSubscriptionSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [successData, setSuccessData] = useState<SubscriptionSuccessData | null>(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // Memoize URL parameters parsing to avoid recreating on every render
  const urlParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  // Memoize subscription parameters check
  const subscriptionParams = useMemo(() => ({
    subscriptionId: urlParams.get('subscriptionId'),
    subscriptionCustomer: urlParams.get('subscriptionCustomer'),
    redirectStatus: urlParams.get('redirect_status')
  }), [urlParams]);

  // Check if we have valid subscription success parameters
  const hasSubscriptionParams = useMemo(() =>
    subscriptionParams.subscriptionId &&
    subscriptionParams.subscriptionCustomer &&
    subscriptionParams.redirectStatus === 'succeeded',
    [subscriptionParams]
  );

  // Only fetch plans if we have subscription success parameters
  const { data: availablePlans = [] } = useGetSubscriptionPlansQuery(undefined, {
    skip: !hasSubscriptionParams
  });

  useEffect(() => {
    // Check if this is a subscription success URL
    if (hasSubscriptionParams && subscriptionParams.subscriptionId && subscriptionParams.subscriptionCustomer && subscriptionParams.redirectStatus) {
      console.log('🎉 Subscription success detected:', {
        subscriptionId: subscriptionParams.subscriptionId,
        subscriptionCustomer: subscriptionParams.subscriptionCustomer,
        redirectStatus: subscriptionParams.redirectStatus
      });

      // Since subscription ID is the same as plan ID, we can directly match it
      let matchedPlan: SubscriptionPlan | undefined;

      if (availablePlans.length > 0) {
        // Direct match: subscriptionId === planId
        matchedPlan = availablePlans.find(plan => plan.id === subscriptionParams.subscriptionId);

        if (matchedPlan) {
          console.log('✅ Plan matched successfully:', {
            planId: matchedPlan.id,
            planName: matchedPlan.name,
            planPrice: matchedPlan.price
          });
        } else {
          console.warn('⚠️ No plan found for subscription ID:', subscriptionParams.subscriptionId);
          console.log('Available plans:', availablePlans.map(p => ({ id: p.id, name: p.name })));
        }
      } else {
        console.warn('⚠️ No plans available in Redux store yet. Plans will be fetched shortly.');
      }

      const detectedSuccessData: SubscriptionSuccessData = {
        subscriptionId: subscriptionParams.subscriptionId,
        subscriptionCustomer: subscriptionParams.subscriptionCustomer,
        redirectStatus: subscriptionParams.redirectStatus,
        plan: matchedPlan
      };

      setSuccessData(detectedSuccessData);
      setShowSuccessAnimation(true);

      // Clean up URL parameters after detecting success
      // This prevents the animation from showing again on page refresh
      const cleanUrl = `${location.pathname}`;
      navigate(cleanUrl, { replace: true });
    }
  }, [hasSubscriptionParams, subscriptionParams, availablePlans, navigate, location.pathname]);

  const hideSuccessAnimation = () => {
    setShowSuccessAnimation(false);
    setSuccessData(null);
  };

  return {
    successData,
    showSuccessAnimation,
    hideSuccessAnimation,
    isSubscriptionSuccess: !!successData
  };
}
