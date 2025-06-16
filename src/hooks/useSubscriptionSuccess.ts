import type { RootState } from 'src/services/store';
import type { SubscriptionPlan } from 'src/services/apis/subscriptionApi';

import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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

  // Get plans from Redux store
  const availablePlans = useSelector((state: RootState) => state.subscription.availablePlans);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    
    const subscriptionId = urlParams.get('subscriptionId');
    const subscriptionCustomer = urlParams.get('subscriptionCustomer');
    const redirectStatus = urlParams.get('redirect_status');

    // Check if this is a subscription success URL
    if (subscriptionId && subscriptionCustomer && redirectStatus === 'succeeded') {
      console.log('🎉 Subscription success detected:', {
        subscriptionId,
        subscriptionCustomer,
        redirectStatus
      });

      // Since subscription ID is the same as plan ID, we can directly match it
      let matchedPlan: SubscriptionPlan | undefined;

      if (availablePlans.length > 0) {
        // Direct match: subscriptionId === planId
        matchedPlan = availablePlans.find(plan => plan.id === subscriptionId);

        if (matchedPlan) {
          console.log('✅ Plan matched successfully:', {
            planId: matchedPlan.id,
            planName: matchedPlan.name,
            planPrice: matchedPlan.price
          });
        } else {
          console.warn('⚠️ No plan found for subscription ID:', subscriptionId);
          console.log('Available plans:', availablePlans.map(p => ({ id: p.id, name: p.name })));
        }
      } else {
        console.warn('⚠️ No plans available in Redux store yet. Plans will be fetched shortly.');
      }

      const detectedSuccessData: SubscriptionSuccessData = {
        subscriptionId,
        subscriptionCustomer,
        redirectStatus,
        plan: matchedPlan
      };

      setSuccessData(detectedSuccessData);
      setShowSuccessAnimation(true);

      // Clean up URL parameters after detecting success
      // This prevents the animation from showing again on page refresh
      const cleanUrl = `${location.pathname}`;
      navigate(cleanUrl, { replace: true });
    }
  }, [location.search, availablePlans, navigate, location.pathname]);

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
