<script setup lang="ts">
import { computed, type Ref } from 'vue';
import { useElevatorStore } from '@/stores/pressInner.ts';
import { storeToRefs } from 'pinia';

const props = defineProps({
  id: Number,
});
const elevatorStore = useElevatorStore()
const openIds = computed(() => elevatorStore.openIds)
const { currentFloors } = elevatorStore
const { activeUpIds, activeDownIds } = storeToRefs(elevatorStore)
// const currentFloors = computed(() => useElevatorStore().currentFloors)
const currentFloor = currentFloors[props.id!-1]
// 获取 activeUpId 和 activeDownId

</script>

<template>
  <div class="show-pannel">
    <div class="icons" style="font-size: 20px">
      <WarningFilled style="width: 1em; height: 1em; margin-right: 8px" />
        <el-icon :class="{ active: activeUpIds.includes(props.id!) } "><Top /></el-icon>
        <span :class="{ active: openIds[props.id! - 1].includes(props.id)}">{{ currentFloor }}</span>
        <el-icon :class="{ active: activeDownIds.includes(props.id!)} "><Bottom /></el-icon>
      <WarningFilled style="width: 1em; height: 1em; margin-left: 8px" />
    </div>
  </div>
</template>

<style src="../assets/styles.css" scoped>

</style>