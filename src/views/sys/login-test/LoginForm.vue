<template>
  <h2 class="mb-3 text-2xl font-bold text-center xl:text-3xl enter-x xl:text-left"> 登录 </h2>
  <Form
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    @keypress.enter="handleLogin"
    :style="{ width: '371px' }"
  >
    <FormItem name="loginName" class="enter-x">
      <Input
        size="large"
        v-model:value="formData.loginName"
        placeholder="账号"
        class="fix-auto-fill"
      />
    </FormItem>
    <FormItem name="password" class="enter-x">
      <InputPassword
        size="large"
        visibilityToggle
        v-model:value="formData.password"
        placeholder="密码"
      />
    </FormItem>

    <ARow class="enter-x">
      <ACol :span="12">
        <FormItem style="margin-bottom: 12px">
          <!-- No logic, you need to deal with it yourself -->
          <Checkbox v-model:checked="formData.rememberMe" size="small"> 记住我 </Checkbox>
        </FormItem>
      </ACol>
    </ARow>

    <FormItem class="enter-x">
      <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
        登录
      </Button>
    </FormItem>
  </Form>
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { Checkbox, Form, Input, Row, Col, Button } from 'ant-design-vue';
  import { RuleObject } from 'ant-design-vue/lib/form';
  import { Buffer } from 'buffer';

  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import { getAppEnvConfig } from '/@/utils/env';

  const ACol = Col;
  const ARow = Row;
  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { notification } = useMessage();
  const userStore = useUserStore();
  const getFormRules = {
    loginName: {
      required: true,
      message: '请输入账号',
      trigger: 'change',
    } as RuleObject,
    password: {
      required: true,
      message: '请输入密码',
      trigger: 'change',
    } as RuleObject,
  };

  const formRef = ref();
  const loading = ref(false);
  const cachedUserKey = 'CACHE_USER_KEY';

  const formData = reactive({
    loginName: '',
    password: '',
    rememberMe: true,
  });

  async function handleLogin() {
    const { VITE_GLOB_APP_ID, VITE_GLOB_DEVICE_ID, VITE_GLOB_PWD_EXPIRE_IN_DAYS } =
      getAppEnvConfig();
    const data = await formRef.value.validate();
    console.log('handleLogin', data);
    if (!data) return;
    try {
      loading.value = true;
      const userInfo = await userStore.loginTest({
        loginName: formData.loginName,
        password: formData.password,
        applicationId: parseInt(VITE_GLOB_APP_ID),
        deviceId: parseInt(VITE_GLOB_DEVICE_ID),
        mode: 'none', //不要默认的错误提示
      });
      if (userInfo) {
        // 记住或清除密码
        if (formData.rememberMe) {
          const userJson = JSON.stringify({
            loginName: formData.loginName,
            password: Buffer.from(formData.password).toString('base64'),
          });
          localStorage.setItem(cachedUserKey, userJson);
        } else {
          localStorage.removeItem(cachedUserKey);
        }

        //密码过期提示
        if (
          userInfo.pwdExpiredInDays !== undefined &&
          (userInfo.pwdExpiredInDays ?? 0) < parseInt(VITE_GLOB_PWD_EXPIRE_IN_DAYS)
        ) {
          notification.warning({
            message: '密码更新提示',
            description:
              (userInfo.pwdExpiredInDays ?? 0) > 0
                ? `您的密码即将过期，剩余有效天数为 ${
                    userInfo.pwdExpiredInDays ?? 0
                  } 天，请及时更新密码！`
                : `您的密码已过期，请及时更新密码！`,
            duration: 3,
          });
        } else {
          notification.success({
            message: '登录成功',
            description: `欢迎回来: ${userInfo.loginName}`,
            duration: 3,
          });
        }
      }
    } finally {
      loading.value = false;
    }
  }

  const loadUserInfo = () => {
    const cachedJson = localStorage.getItem(cachedUserKey) || '{}';
    const cachedUserInfo = JSON.parse(cachedJson);
    if (cachedUserInfo && cachedUserInfo.loginName) {
      formData.loginName = cachedUserInfo.loginName;
      formData.password = Buffer.from(cachedUserInfo.password, 'base64').toString();
      formData.rememberMe = true;
    }
  };

  loadUserInfo();
</script>
