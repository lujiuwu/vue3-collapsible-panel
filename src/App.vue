<script setup lang="ts">
  import { ref } from 'vue';
  import { Demo } from './components/demo';
  const opened = ref(false);
  const content = ref([
    {
      label: '测试1',
      value: '测试1'
    }
  ])
  const useAdd = (value: { label: string, value: string }) => {
    content.value.push(value);
  }
  const useRemove = (value: { label: string, value: string }) => {
    content.value = content.value.filter((item: { label: string, value: string }) => item.value !== value.value);
  }
</script>

<template>
  <div>
    <Demo v-model="opened" lasting_time="500">
       <template #default>
        默认内容
       </template>
       
       <template #collapse>
        面板内容
        <button @click="useAdd({ label: '测试2', value: '测试2' })">添加</button>
        <div class="test" v-for="(item,index) in content" :key="index">
          <span>{{ item.label }}</span>
          <button @click="useRemove(item)">删除</button>
        </div>
       </template>
    </Demo>
  </div>
</template>

