import packageJson from '../package.json';

// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
  useMockApi: boolean;
};

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  appName: 'xBlog AI',
  appVersion: packageJson.version,
  useMockApi: import.meta.env.VITE_USE_MOCK_API === 'true',
};
