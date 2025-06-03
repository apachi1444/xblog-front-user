import type { RootState } from 'src/services/store';

export const selectCurrentStore = (state: RootState) => state.stores.currentStore;