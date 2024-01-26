import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
import { isDevMode } from '/@/utils/env';

const advanced: AppRouteModule = {
  path: '/advanced',
  name: 'Advanced',
  component: LAYOUT,
  redirect: '/advanced/breakpoint-resume',
  meta: {
    orderNo: 0,
    icon: 'ion:paper-plane-outline',
    title: 'Vue高级功能',
    hideMenu: !isDevMode(),
  },
  children: [
    {
      path: '/advanced/breakpoint-resume',
      name: 'BreakpointResume',
      component: () => import('/@/views/advanced/breakpoint-resume/index.vue'),
      meta: {
        title: '断点续传',
      },
    },
    {
      path: '/advanced/virtual-list',
      name: 'VirtualList',
      component: () => import('/@/views/advanced/virtual-list/index.vue'),
      meta: {
        title: '虚拟列表',
      },
    },
  ],
};

export default advanced;
