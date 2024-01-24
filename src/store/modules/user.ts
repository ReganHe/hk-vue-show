import type { UserInfo } from '/#/store';
import type { ErrorMessageMode } from '/#/axios';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { RoleEnum } from '/@/enums/roleEnum';
import { PageEnum } from '/@/enums/pageEnum';
import { GetUserLoginInfoModel, LoginParams, LoginTestParams } from '/@/api/sys/model/userModel';
import { useMessage } from '/@/hooks/web/useMessage';
import { router } from '/@/router';
import { usePermissionStore } from '/@/store/modules/permission';
import { RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
import { isArray } from '/@/utils/is';
import { h } from 'vue';
import { getUserByUserId } from '/@/api/auto/ApiUserCustom';
import { getCurrentLoginUserInfo } from '/@/api/auto/ApiGwsUserInfo';

import {
  accountLogin4Direct,
  accountLogin4Frontend,
  accountLogout,
  exchangeAccessToken,
} from '/@/api/auto/ApiGwsAccount';
import { getUnreadCount } from '/@/api/auto/ApiMessage';

interface UserState {
  userInfo: Nullable<UserInfo>;
  token: string;
  roleList: RoleEnum[];
  lastUpdateTime: number;
  unReadedMessageNum: number;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: localStorage.getItem('token') ?? '',
    // roleList
    roleList: [],
    // Last fetch time
    lastUpdateTime: 0,
    unReadedMessageNum: 0,
  }),
  getters: {
    getUserInfo(): UserInfo | null {
      return this.userInfo;
    },
    getToken(): string {
      return this.token;
    },
    getRoleList(): RoleEnum[] {
      return this.roleList;
    },
    getMenuPermList(): any[] {
      return this.userInfo?.menuPerms ?? [];
    },
    getLastUpdateTime(): number {
      return this.lastUpdateTime;
    },
    getUnReadedMessageNum(): number {
      return this.unReadedMessageNum;
    },
  },
  actions: {
    setToken(token: string) {
      this.token = token; // for null or undefined value
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
    },
    setUnReadedMessageNum(num: number) {
      this.unReadedMessageNum = num;
      const permissionStore = usePermissionStore();
      const messageMenuTag: any = permissionStore.getFrontMenuList.find(
        (r) => r.name === '消息通知'
      )?.meta?.tag;
      if (messageMenuTag) {
        messageMenuTag.content = num;
      }
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      }
    ): Promise<GetUserLoginInfoModel | null> {
      try {
        const { goHome = true, ...loginParams } = params;
        // 1. 获取正式令牌
        const refreshTokenRes = await accountLogin4Frontend(loginParams);
        console.log('refreshTokenRes', refreshTokenRes);
        // 2.获取访问令牌
        const accessTokenRes = await exchangeAccessToken({
          refreshToken: refreshTokenRes.token,
        });
        console.log('accessTokenRes', accessTokenRes);

        // save token
        this.setToken(accessTokenRes.token);
        localStorage.setItem('token', accessTokenRes.token);
        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    /**
     * @description: login
     */
    async loginTest(
      params: LoginTestParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      }
    ): Promise<GetUserLoginInfoModel | null> {
      try {
        const { goHome = true, ...loginParams } = params;
        // 1. 获取正式令牌
        const refreshTokenRes = await accountLogin4Direct(loginParams);
        console.log('refreshTokenRes', refreshTokenRes);
        // 2.获取访问令牌
        const accessTokenRes = await exchangeAccessToken({
          refreshToken: refreshTokenRes.token,
        });
        console.log('accessTokenRes', accessTokenRes);

        // save token
        this.setToken(accessTokenRes.token);
        localStorage.setItem('token', accessTokenRes.token);
        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async afterLoginAction(goHome?: boolean): Promise<GetUserLoginInfoModel | null> {
      if (!this.getToken) {
        return null;
      }

      // get user info
      const userInfo = await this.getUserInfoAction();
      const permissionStore = usePermissionStore();
      if (!permissionStore.isDynamicAddedRoute) {
        const routes = await permissionStore.buildRoutesAction();
        routes.forEach((route) => {
          router.addRoute(route as unknown as RouteRecordRaw);
        });
        router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
        permissionStore.setDynamicAddedRoute(true);
      }

      goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME));
      return userInfo;
    },
    async getUserInfoAction(): Promise<GetUserLoginInfoModel | null> {
      if (!this.getToken) return null;
      const [userInfoRes, messageRes] = await Promise.all([
        getCurrentLoginUserInfo(),
        getUnreadCount(),
      ]);
      const userInfo = userInfoRes as unknown as UserInfo;
      const userBasicInfo = await getUserByUserId({ userId: parseInt(userInfo.id) });
      const { roles = [] } = userInfo;
      if (isArray(roles)) {
        const roleList = roles.map((item) => item.code) as RoleEnum[];
        this.setRoleList(roleList);
      } else {
        userInfo.roles = [];
        this.setRoleList([]);
      }
      userInfo.orgId = (userBasicInfo.stationInfo || userBasicInfo || {}).orgId;
      userInfo.orgName = (userBasicInfo.stationInfo || userBasicInfo || {}).orgName;
      userInfo.orgCode = userBasicInfo.orgCode;
      userInfo.stationType = (userBasicInfo.station || userBasicInfo || {}).stationType;
      userInfo.parentId = userBasicInfo.parentId;
      userInfo.typeId = userBasicInfo.typeId;
      userInfo.type = userBasicInfo.type;
      userInfo.typeName = userBasicInfo.typeName;
      userInfo.path = userBasicInfo.path;
      userInfo.userType = userBasicInfo.userType;
      this.setUserInfo(userInfo);
      this.setUnReadedMessageNum(messageRes);
      return userInfo;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      if (this.getToken) {
        try {
          await accountLogout();
        } catch {
          console.log('注销Token失败');
        }
      }
      this.setToken('');
      this.setUserInfo(null);
      localStorage.setItem('token', '');
      goLogin && router.push(PageEnum.BASE_LOGIN);
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', '温馨提醒'),
        content: () => h('span', '是否确认退出系统？'),
        onOk: async () => {
          await this.logout(true);
        },
      });
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
