<script setup lang="ts">
import { useElevatorStore } from '@/stores/pressInner.ts';
import { storeToRefs } from 'pinia';
import { computed, inject, ref, watch, type Ref } from 'vue';

const elevatorStore = useElevatorStore()
const { opens, closes, currentFloors, operateElevator, handleFloors, elevatorStates } = elevatorStore
const { activeUpIds, activeDownIds } = storeToRefs(elevatorStore)
const props = defineProps({
  id: {
    type: Number,
    required: true, // 确保 id 必须传递
    // default: 1, // 设置默认值
  },
});

const openIds = computed(() => elevatorStore.openIds)
const closeIds = computed(() => elevatorStore.closeIds)
const isDisabledButtons = computed(() => elevatorStore.isDisabledButtons)
// console.log(isDisabledButtons.value);

// const { openIds, closeIds } = elevatorStates[props.id!-1]
const currentFloor = currentFloors[props.id!-1]
// console.log(isDisabledButtons.value);

// const isDisabledButton = isDisabledButtons.value[props.id!-1]

// watch(isDisabledButton, (newValue, oldValue) => {
//   console.log('count 变化了:', oldValue, '->', newValue);
// });

</script>

<template>
  <div class="buttons" >
    <span v-for="buttonNumber in 20" :key="buttonNumber" class="button-box">
      <el-button 
      @click="handleFloors(buttonNumber, currentFloors, props.id!)"
      :disabled="isDisabledButtons[props.id! - 1].includes(buttonNumber)"
      class="button" 
      type="info"
      plain
      >{{ buttonNumber }}</el-button>
    </span>
    <span class="button-box">
      <el-button 
      @click="operateElevator('open', opens, props.id!)" 
      class="button" type="warning" 
      :plain="openIds[props.id! - 1].includes(props.id)? !opens[props.id!-1].value : true"
      :disabled="!(activeUpIds.length === 0 && activeDownIds.length === 0)"
      >   
        <span>
          <CaretLeft style="width: 1em; height: 1em; margin-left: 1px" />
          <CaretRight style="width: 1em; height: 1em; margin-right: 1px" />
        </span>
      </el-button>
    </span>
    <span class="button-box">
      <el-button 
      @click="operateElevator('close', closes, props.id!)" 
      class="button" type="warning" 
      :plain="closeIds[props.id! - 1].includes(props.id)? !closes[props.id!-1].value : true"
      :disabled="!(activeUpIds.length === 0 && activeDownIds.length === 0)"
      >
        <span>
          <CaretRight style="width: 1em; height: 1em; margin-left: 1px;" />
          <CaretLeft style="width: 1em; height: 1em; margin-right: 1px;" />
        </span>
      </el-button>
    </span>
    <span class="button-box">
      <el-button class="button" type="danger" plain>
        <el-icon><BellFilled /></el-icon>
      </el-button>
    </span>
    <span class="button-box">
      <el-button class="button" type="primary" plain disabled>
        {{ openIds[props.id! - 1].includes(props.id) ? '开' : '关'}}
      </el-button>
    </span>
  </div>
</template>

<style src="../assets/styles.css" scoped>
</style>
