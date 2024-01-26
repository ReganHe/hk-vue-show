<template>
  <VirtualList
    v-if="listDataRef.length > 0"
    :listData="listDataRef"
    :itemHeight="50"
    :scrollHeight="600"
    :loadMore="loadMore"
  >
    <template #item="{ item }">
      <div class="list-item">
        {{ item }}
      </div>
    </template>
  </VirtualList>
</template>

<script setup>
  import { onMounted, ref } from 'vue';
  import VirtualList from './components/VirtualList.vue';

  let listDataRef = ref([]);
  let listTotalRef = ref(200);

  onMounted(() => {
    fetchData();
  });

  // 模拟从 API 获取数据
  const fetchData = async () => {
    // 这里可以替换成您实际的 API 请求
    await new Promise((resolve) => {
      setTimeout(() => {
        const newData = Array.from({ length: listTotalRef.value }, (_, index) => `Item ${index}`);
        listDataRef.value = newData;
        resolve();
      }, 500);
    });
  };

  // 加载更多数据
  const loadMore = () => {
    // 这里可以替换成您实际的 API 请求
    return new Promise((resolve) => {
      setTimeout(() => {
        const moreData = Array.from(
          { length: 30 },
          (_, index) => `Item ${listTotalRef.value + index}`
        );
        listTotalRef.value += 30;
        resolve(moreData);
      }, 500);
    });
    //模拟请求错误
    // return new Promise((_, reject) => {
    //   setTimeout(() => {
    //     reject('错误模拟');
    //   }, 1000);
    // })
  };
</script>

<style lang="scss" scoped>
  .list-item {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #ccc;
    text-align: center;
  }
</style>
