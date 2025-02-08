<script setup lang="ts">
import { useElevatorStore } from '@/stores/pressInner.ts';
import { usePublishStore } from '@/stores/pressOuter.ts';
import { storeToRefs } from 'pinia';
import { computed, type Ref } from 'vue';

const elevatorStore = useElevatorStore()
const PublishStore = usePublishStore()
// const { currentFloors } = elevatorStore
const { publishElevator } = PublishStore
const currentFloors = computed(() => elevatorStore.currentFloors) 
const { activeUpIds, activeDownIds } = storeToRefs(elevatorStore)
const reqFloor = computed(() => PublishStore.reqFloor) 
// console.log(currentFloors.value);
console.log(reqFloor);

</script>

<template>
  <div class="buttons">
    <span v-for="buttonNumber in 20" :key="buttonNumber" class="button-box2">
      <el-button class="button-two" @click="publishElevator(buttonNumber, currentFloors)" type="primary" :plain="!(activeUpIds.length > 0 && reqFloor.includes(buttonNumber))">
        <ArrowUpBold 
        :class="{ active: activeUpIds.length > 0 && reqFloor.includes(buttonNumber)}" style="width: 1em; height: 1em;"/>
      </el-button>
      <el-button class="button-two" type="primary" plain disabled>{{ buttonNumber }}</el-button>
      <el-button class="button-two" @click="publishElevator(buttonNumber, currentFloors)" type="primary" :plain="!(activeDownIds.length > 0 && reqFloor.includes(buttonNumber))">
        <ArrowDownBold
        :class="{ active: activeDownIds.length > 0 && reqFloor.includes(buttonNumber)}" style="width: 1em; height: 1em;"/>
      </el-button>
    </span>
  </div>
</template>

<style src="../assets/styles.css"  scoped>

</style>