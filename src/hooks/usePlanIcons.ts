import { useTranslation } from 'react-i18next';

/**
 * Custom hook for getting plan icons and localized plan information
 * 
 * @returns Functions for getting plan icons and localized plan names
 */
export const usePlanIcons = () => {
  const { t } = useTranslation();

  /**
   * Get an appropriate icon based on plan type/name
   * 
   * @param planName - The name of the plan
   * @returns The icon name to use for the plan
   */
  const getPlanIcon = (planName: string): string => {
    // Convert plan name to lowercase for case-insensitive comparison
    const name = planName.toLowerCase();
    
    if (name.includes('free')) {
      return 'mdi:gift-outline'; // Gift icon for free plan
    }
    if (name.includes('basic') || name.includes('starter')) {
      return 'mdi:rocket-launch'; // Rocket icon for basic/starter plan
    }
    if (name.includes('pro') || name.includes('professional')) {
      return 'mdi:diamond'; // Diamond icon for pro/professional plan
    }
    if (name.includes('business')) {
      return 'mdi:briefcase'; // Briefcase icon for business plan
    }
    if (name.includes('enterprise')) {
      return 'mdi:office-building'; // Building icon for enterprise plan
    }
    if (name.includes('premium')) {
      return 'mdi:crown'; // Crown icon for premium plan
    }
    
    // Default icon if no match
    return 'mdi:shield-star'; // Shield star as default
  };

  /**
   * Get localized plan name
   * 
   * @param planName - The original plan name
   * @returns The localized plan name
   */
  const getLocalizedPlanName = (planName: string): string => {
    // Convert plan name to lowercase for case-insensitive comparison
    const name = planName.toLowerCase();
    
    if (name.includes('free')) {
      return t('plans.free.name', 'Free');
    }
    if (name.includes('basic')) {
      return t('plans.basic.name', 'Basic');
    }
    if (name.includes('pro') || name.includes('professional')) {
      return t('plans.pro.name', 'Professional');
    }
    if (name.includes('business')) {
      return t('plans.business.name', 'Business');
    }
    if (name.includes('enterprise')) {
      return t('plans.enterprise.name', 'Enterprise');
    }
    
    // If no match, return the original name
    return planName;
  };

  /**
   * Transform a plan object to include the appropriate icon
   * 
   * @param plan - The plan object
   * @returns The plan object with icon added
   */
  const enrichPlanWithIcon = <T extends { name: string; icon?: string }>(plan: T): T => {
    return {
      ...plan,
      icon: plan.icon || getPlanIcon(plan.name)
    };
  };

  return {
    getPlanIcon,
    getLocalizedPlanName,
    enrichPlanWithIcon
  };
};
