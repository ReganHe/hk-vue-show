<template>
  <FormItem
    :label="label"
    :name="dataField"
    v-bind="extendProps.formItemProps"
    v-if="!visibleValidator || visibleValidator({ model })"
  >
    <Select
      v-if="type === 'select'"
      v-model:value="model[dataField]"
      placeholder="请选择"
      :disabled="disableValidator && disableValidator({ model })"
      :allow-clear="true"
      v-bind="elementProps"
    />
    <DatePicker
      v-else-if="type === 'date'"
      v-model:value="model[dataField]"
      placeholder="请选择"
      :disabled="disableValidator && disableValidator({ model })"
      :allow-clear="true"
      v-bind="elementProps"
    />
    <RangePicker
      v-else-if="type === 'dateRange'"
      v-model:value="model[dataField]"
      :disabled="disableValidator && disableValidator({ model })"
      :allow-clear="true"
      v-bind="elementProps"
    />
    <TimePicker
      v-else-if="type === 'time'"
      v-model:value="model[dataField]"
      placeholder="请选择"
      :disabled="disableValidator && disableValidator({ model })"
      :allow-clear="true"
      v-bind="elementProps"
    />
    <TimeRangePicker
      v-else-if="type === 'timeRange'"
      v-model:value="model[dataField]"
      :disabled="disableValidator && disableValidator({ model })"
      :allow-clear="true"
      v-bind="elementProps"
    />
    <Input
      v-else
      v-model:value="model[dataField]"
      placeholder="请输入"
      :disabled="disableValidator && disableValidator({ model })"
      v-bind="{ size: configProvider.componentSize, ...elementProps }"
      @pressEnter="handleInputEnter"
    />
  </FormItem>
</template>

<script lang="ts" setup>
  import { computed, inject } from 'vue';
  import {
    FormItem,
    Input,
    Select,
    DatePicker,
    RangePicker,
    TimePicker,
    TimeRangePicker,
  } from 'ant-design-vue';
  const props = defineProps({
    type: {
      type: String,
      default: undefined,
    },
    label: {
      type: String,
      default: undefined,
    },
    defaultModel: {
      type: Object,
      default: () => {},
    },
    dataField: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: undefined,
    },
    disableValidator: {
      type: Function,
      default: undefined,
    },
    visibleValidator: {
      type: Function,
      default: () => true,
    },
    elementProps: {
      type: Object,
      default() {
        return {
          valueFormat: 'yyyy-MM-dd',
        };
      },
    },
    extendProps: {
      type: Object,
      default: () => ({}),
    },
  });

  const emits = defineEmits(['enterKeyDown']);

  const model = computed(() => props.defaultModel);

  const configProvider: any = inject('configProvider');

  // input回车
  const handleInputEnter = () => {
    emits('enterKeyDown');
  };
  // select回车
  // const handleSelectEnter = (e) => {
  //   if (e.key === 'Enter') emits('enterKeyDown');
  // };
</script>

<style lang="scss" scoped></style>
