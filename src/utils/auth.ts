export const getToken = () => {
  try {
    return sessionStorage.getItem('access_token');
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

export const setToken = (access_token: string | null): void => {
  try {
    sessionStorage.setItem('access_token', access_token ?? "");
  } catch (error) {
    console.error('Error retrieving token:', error);
  }
};
