<template>
  <ConfigProvider :locale="zhCN" :component-size="'small'">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import { ConfigProvider } from 'ant-design-vue';
  import zhCN from 'ant-design-vue/es/locale/zh_CN';
  import dayjs from 'dayjs';
  import 'dayjs/locale/zh-cn';

  import { AppProvider } from '/@/components/Application';
  import { useTitle } from '/@/hooks/web/useTitle';

  // 本土化设置
  dayjs.locale('zh-cn');

  // Listening to page changes and dynamically changing site titles
  useTitle();
</script>
