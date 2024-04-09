<template>
  <div
    class="scroll-box"
    ref="scrollBox"
    @scroll="handleScroll"
    :style="{ height: scrollHeight + 'px' }"
  >
    <div
      class="virtual-list"
      :style="{ paddingTop: paddingTop + 'px', paddingBottom: paddingBottom + 'px' }"
    >
      <div
        v-for="(item, index) in visibleItems"
        :key="index"
        :style="{ height: itemHeight + 'px' }"
      >
        <slot name="item" :item="item" :index="index"></slot>
      </div>
    </div>
    <Loading :is-show="isShowLoad" />
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { message } from 'ant-design-vue';
  import Loading from './Loading.vue';

  const props = defineProps({
    listData: { type: Array, default: () => [] },
    itemHeight: { type: Number, default: 50 },
    scrollHeight: { type: Number, default: 300 },
    loadMore: { type: Function, required: true },
  });

  const visibleCount = Math.ceil(props.scrollHeight / props.itemHeight) + 1;
  let loadingLock = false;
  let lockLoadMoreByHideLoading_once = false;

  const isShowLoad = ref(false);
  const start = ref(0);
  const renderData = ref([...props.listData]);
  const scrollBox = ref(null);
  let lastIndex = start.value;

  const end = computed(() => Math.min(start.value + 2 * visibleCount - 1, renderData.value.length));
  const paddingTop = computed(() => start.value * props.itemHeight);
  const paddingBottom = computed(() => (renderData.value.length - end.value) * props.itemHeight);
  const visibleItems = computed(() => renderData.value.slice(start.value, end.value));

  onMounted(() => {
    scrollBox.value?.addEventListener('scroll', handleScroll);
  });

  onUnmounted(() => {
    scrollBox.value?.removeEventListener('scroll', handleScroll);
  });

  const handleScroll = rafThrottle(() => {
    onScrollToBottom();
    onScrolling();
  });

  const onScrolling = () => {
    const scrollTop = scrollBox.value.scrollTop;
    let thisStartIndex = Math.floor(scrollTop / props.itemHeight);
    const isSomeStart = thisStartIndex == lastIndex;
    if (isSomeStart) return;
    const isEndIndexOverListLen = thisStartIndex + 2 * visibleCount - 1 >= renderData.value.length;
    if (isEndIndexOverListLen) {
      thisStartIndex = renderData.value.length - (2 * visibleCount - 1);
    }
    lastIndex = thisStartIndex;
    start.value = thisStartIndex;
  };

  const onScrollToBottom = () => {
    const scrollTop = scrollBox.value.scrollTop;
    const clientHeight = scrollBox.value.clientHeight;
    const scrollHeight = scrollBox.value.scrollHeight;
    if (scrollTop + clientHeight >= scrollHeight) {
      loadMore();
    }
  };

  const loadMore = async () => {
    if (loadingLock) return;
    if (lockLoadMoreByHideLoading_once) {
      lockLoadMoreByHideLoading_once = false;
      return;
    }
    loadingLock = true;
    isShowLoad.value = true;
    const moreData = await props.loadMore().catch((err) => {
      console.error(err);
      message.success('获取数据失败，请检查网络后重试');
      return [];
    });
    if (moreData.length != 0) {
      renderData.value = [...renderData.value, ...moreData];
      handleScroll();
    }
    isShowLoad.value = false;
    lockLoadMoreByHideLoading_once = true;
    loadingLock = false;
  };

  function rafThrottle(fn) {
    let lock = false;
    return function (...args) {
      if (lock) return;
      lock = true;
      window.requestAnimationFrame(() => {
        fn.apply(args);
        lock = false;
      });
    };
  }
</script>

<style lang="scss" scoped>
  .scroll-box {
    overflow-y: auto;
    .virtual-list {
      position: relative;
      background: #ffffff;
      margin: 16px;
    }
  }
</style>
