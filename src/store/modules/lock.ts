import type { LockInfo } from '/#/store';

import { defineStore } from 'pinia';

import { LOCK_INFO_KEY } from '/@/enums/cacheEnum';
import { Persistent } from '/@/utils/cache/persistent';
import { useUserStore } from './user';
import { getAppEnvConfig } from '/@/utils/env';

interface LockState {
  lockInfo: Nullable<LockInfo>;
}

export const useLockStore = defineStore({
  id: 'app-lock',
  state: (): LockState => ({
    lockInfo: Persistent.getLocal(LOCK_INFO_KEY),
  }),
  getters: {
    getLockInfo(): Nullable<LockInfo> {
      return this.lockInfo;
    },
  },
  actions: {
    setLockInfo(info: LockInfo) {
      this.lockInfo = Object.assign({}, this.lockInfo, info);
      Persistent.setLocal(LOCK_INFO_KEY, this.lockInfo, true);
    },
    resetLockInfo() {
      Persistent.removeLocal(LOCK_INFO_KEY, true);
      this.lockInfo = null;
    },
    // Unlock
    async unLock(password?: string) {
      const userStore = useUserStore();
      if (this.lockInfo?.pwd === password) {
        this.resetLockInfo();
        return true;
      }

      const tryLogin = async () => {
        try {
          const { VITE_GLOB_APP_ID, VITE_GLOB_DEVICE_ID } = getAppEnvConfig();
          const loginName = userStore.getUserInfo?.loginName || '';
          const res = await userStore.loginTest({
            loginName: loginName,
            password: password!,
            applicationId: parseInt(VITE_GLOB_APP_ID),
            deviceId: parseInt(VITE_GLOB_DEVICE_ID),
            goHome: false,
            mode: 'none',
          });
          if (res) {
            this.resetLockInfo();
          }
          return res;
        } catch (error) {
          return false;
        }
      };
      return await tryLogin();
    },
  },
});
