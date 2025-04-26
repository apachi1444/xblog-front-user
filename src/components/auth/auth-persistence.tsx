import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { rehydrateAuth } from 'src/services/slices/auth/authSlice';

export function AuthPersistence() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(rehydrateAuth());
  }, [dispatch]);

  return null;
}