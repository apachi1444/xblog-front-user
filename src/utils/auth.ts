export const getToken = (): string => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error("Access token not found in localStorage");
  }
  return token;
};
