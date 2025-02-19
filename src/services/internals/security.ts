// eslint-disable-next-line @typescript-eslint/no-explicit-any
let getAccessTokenSilently: ((options?: any) => Promise<string>) | undefined;

interface SecurityType {
  getAccessTokenFunction: () => typeof getAccessTokenSilently;
  setAccessTokenFunction: (func: typeof getAccessTokenSilently) => void;
}

export const security: SecurityType = {
  getAccessTokenFunction: () => getAccessTokenSilently,
  setAccessTokenFunction: (func) => {
    getAccessTokenSilently = func;
  },
};
