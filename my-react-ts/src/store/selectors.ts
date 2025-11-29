import type {RootState} from './index';

export const selectCurrentUser = (state: RootState) => state.auth.user;