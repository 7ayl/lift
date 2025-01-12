<script setup lang="ts">
import { type Ref } from 'vue';
const props = defineProps({
  currentFloor: Object as () => Ref<number> 
});
</script>

<template>
  <div class="show-pannel">
    <div class="icons" style="font-size: 20px">
      <WarningFilled style="width: 1em; height: 1em; margin-right: 8px" />
        <el-icon><Top /></el-icon>
        <span>{{ currentFloor?.value }}</span>
        <el-icon><Bottom /></el-icon>
      <WarningFilled style="width: 1em; height: 1em; margin-left: 8px" />
    </div>
  </div>
</template>

<style src="../assets/styles.css" scoped>

</style>