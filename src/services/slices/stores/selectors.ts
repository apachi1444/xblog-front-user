import type { RootState } from 'src/services/store';

export const selectStores = (state: RootState) => state.stores.stores;