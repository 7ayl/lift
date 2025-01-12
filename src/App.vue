<script setup lang="ts">
import OtherButtons from './components/otherButtons.vue';
import OutButtons from './components/outButtons.vue';
import pannel from './components/pannel.vue';
import { ref, provide, type Ref } from 'vue';


const currentFloors = Array.from({ length: 5 }, () => ref(1)); // 初始化每部电梯的当前楼层为1

const currentElevators: number[] = []
for (let i = 0; i < 5; i++) {
  currentElevators.push(i + 1);
};

// provide('currentFloors', currentFloors);
</script>

<template>
  <div class="app">
    <tr>
      <td v-for="index in 5" :key="index" :id="'elevator' + index" class="td-width">
        <div class="td-sty">
          <pannel :currentFloor="currentFloors[index-1]" />
          <OtherButtons 
          :currentElevator="currentElevators[index-1]" 
          :currentFloor="currentFloors[index-1]"/>
        </div>
      </td>
      <td class="td-widthTwo">
      <div class="td-styleTwo">
        <OutButtons/>
      </div>
    </td>
    </tr>
  </div>
</template>

<style src="./assets/styles.css" scoped>

</style>
