import { useMemo, useState, useContext, createContext, type ReactNode } from 'react';

// ----------------------------------------------------------------------

interface RewardsContextType {
  isRewardsSidebarOpen: boolean;
  openRewardsSidebar: () => void;
  closeRewardsSidebar: () => void;
}

const RewardsContext = createContext<RewardsContextType | undefined>(undefined);

// ----------------------------------------------------------------------

interface RewardsProviderProps {
  children: ReactNode;
}

export function RewardsProvider({ children }: RewardsProviderProps) {
  const [isRewardsSidebarOpen, setIsRewardsSidebarOpen] = useState(false);

  const openRewardsSidebar = () => {
    setIsRewardsSidebarOpen(true);
  };

  const closeRewardsSidebar = () => {
    setIsRewardsSidebarOpen(false);
  };

  const contextValue = useMemo(
    () => ({
      isRewardsSidebarOpen,
      openRewardsSidebar,
      closeRewardsSidebar,
    }),
    [isRewardsSidebarOpen]
  );

  return (
    <RewardsContext.Provider value={contextValue}>
      {children}
    </RewardsContext.Provider>
  );
}

// ----------------------------------------------------------------------

export function useRewards() {
  const context = useContext(RewardsContext);
  if (context === undefined) {
    throw new Error('useRewards must be used within a RewardsProvider');
  }
  return context;
}
