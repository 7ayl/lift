<script setup lang="ts">
import OtherButtons from './components/otherButtons.vue';
import OutButtons from './components/outButtons.vue';
import pannel from './components/pannel.vue';
import { ref, provide, type Ref } from 'vue';

// provide('currentFloors', currentFloors);
</script>

<template>
  <div class="app">
    <tr>
      <td v-for="index in 5" :key="index" :id="'elevator' + index" class="td-width">
        <div class="td-sty">
          <pannel :id="index"/>
          <OtherButtons :id="index"/>
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
