<template>
  <div class="user-info">
    <div class="user-profile">
      <div class="box-center">
        <img v-if="user.avatar" :src="user.avatar" :style="{ height: '100px', width: '100px' }" />
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.userName }}</div>
        <div class="user-role text-center text-muted">{{ (user.roles || []).join(',') }}</div>
      </div>
    </div>
    <div class="user-bio">
      <div class="user-skills user-bio-section">
        <div class="user-bio-section-header">
          <solution-outlined />
          <span>详情</span>
        </div>
        <div class="user-bio-section-body">
          <div class="user-info">
            <div class="item">
              <div class="label">用户账号 :</div>
              <div class="value">{{ user.loginName }}</div>
            </div>
            <div class="item">
              <div class="label">用户名称 :</div>
              <div class="value">{{ user.userName }}</div>
            </div>
            <div class="item" v-if="user.orgName">
              <div class="label">所属机构 :</div>
              <div class="value">{{ user.orgName }}</div>
            </div>
            <div class="item">
              <div class="label">最后登录时间 :</div>
              <div class="value">{{ user.lastLoginTime }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue';
  import { SolutionOutlined } from '@ant-design/icons-vue';

  import { useUserStore } from '/@/store/modules/user';
  import { formatToDateTime } from '/@/utils/dateUtil';
  import headerImg from '/@/assets/images/header.jpg';

  const userStore = useUserStore();
  const user = reactive({
    avatar: userStore.getUserInfo?.avatar || headerImg,
    userName: userStore.getUserInfo?.userName,
    loginName: userStore.getUserInfo?.loginName,
    lastLoginTime: formatToDateTime(userStore.getUserInfo?.lastLoginTime),
    roles: userStore.getUserInfo?.roles.map((r) => r.name),
    orgName: userStore.getUserInfo?.orgName,
  });
</script>

<style lang="scss" scoped>
  .user-info {
    .box-center {
      margin: 0 auto;
      display: table;
    }
    .user-profile {
      .user-name {
        font-weight: bold;
      }

      .box-center {
        padding-top: 10px;
      }

      .user-role {
        padding-top: 10px;
        font-weight: 400;
        font-size: 14px;
      }

      .box-social {
        padding-top: 30px;

        .el-table {
          border-top: 1px solid #dfe6ec;
        }
      }

      .user-follow {
        padding-top: 20px;
      }
    }

    .user-bio {
      margin-top: 20px;
      color: #606266;

      span {
        padding-left: 4px;
      }

      .user-bio-section {
        font-size: 14px;
        padding: 15px 0;

        .user-bio-section-header {
          border-bottom-width: 1px;
          border-bottom-style: solid;
          padding-bottom: 10px;
          margin-bottom: 10px;
          font-weight: bold;
          .skill-icon {
            width: 20px !important;
            height: 20px !important;
          }
        }

        .user-bio-section-body {
          .user-info {
            .item {
              overflow: hidden;
              margin-top: 16px;
              font-size: 14px;
              .label {
                float: left;
                width: 100px;
                font-weight: bold;
                text-align: right;
              }
              .value {
                float: left;
                margin-left: 12px;
              }
            }
          }
        }
      }
    }
  }
</style>
