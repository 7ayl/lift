<script setup lang="ts">

</script>

<template>
  <div class="buttons">
    <span v-for="buttonNumber in 20" :key="buttonNumber" class="button-box2">
      <el-button class="button-two" type="primary" plain><ArrowUpBold style="width: 1em; height: 1em;"/></el-button>
      <el-button class="button-two" type="primary" plain disabled>{{ buttonNumber }}</el-button>
      <el-button class="button-two" type="primary" plain><ArrowDownBold style="width: 1em; height: 1em;"/></el-button>
    </span>
  </div>
</template>

<style src="../assets/styles.css"  scoped>

</style>