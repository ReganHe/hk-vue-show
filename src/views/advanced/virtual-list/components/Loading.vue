<template>
  <div class="loading" v-show="pros.isShow">
    <p>Loading...</p>
  </div>
</template>

<script setup>
  const pros = defineProps({
    isShow: {
      type: Boolean,
      default: false,
    },
  });
</script>

<style lang="scss" scoped>
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    background-color: #f5f5f5;
  }
</style>
