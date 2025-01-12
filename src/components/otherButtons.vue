<script setup lang="ts">
import { inject, ref, watch, type Ref } from 'vue';

let openTimer: any
let closeTimer: any
let character = ref('关')

const props = defineProps({
  currentElevator: Number,
  currentFloor: ref<number>
});

const currentFloor = props.currentFloor?.value
const buttonId = props.currentElevator ? props.currentElevator.toString() : '';

const open = ref(false);
const close = ref(false);


async function operateElevator(action: 'open' | 'close') {
  if (action === 'open') {
    open.value = true;
    close.value = false;
    character.value = '开'
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
    openTimer = setTimeout(() => {
      open.value = false;
      openTimer = null;
      character.value = '关'
    }, 10000);
  } else if (action === 'close') {
    close.value = true;
    open.value = false;
    if (openTimer) {
      clearTimeout(openTimer);
      openTimer = null;
    }
    closeTimer = setTimeout(() => {
      close.value = false;
      closeTimer = null;
    }, 5000);
  }
}

function handleFloors(buttonNum: number, currentFloor: number, currentElevator: number) {
  const changeFloor = buttonNum - currentFloor;

  if (changeFloor !== 0) {
    console.log(`按了第${buttonNum}层`);

    // 判断电梯是否在当前楼层
    if (currentFloor !== buttonNum) {
      upFloors(changeFloor, currentFloor)
        .then((finalFloor) => {
          console.log(`电梯到达目标楼层：${finalFloor}`);
          // 在这里可以添加一些额外的操作，比如改变电梯状态等
        })
        .catch((error) => {
          console.error(`电梯移动出现错误：${error}`);
        });
    } else {
      console.log('电梯正在运行中，请等待...');
    }
  } else {
    console.log('当前楼层就是目标楼层，无需移动电梯。');
  }
}

function upFloors(changeFloor: number, currentFloor: number): Promise<number> {
  return new Promise((resolve, reject) => {
    let targetFloor = currentFloor + changeFloor;
    let current = currentFloor;

    const intervalId = setInterval(() => {
      if (current < targetFloor) {
        current++;
        console.log(`电梯正在上行，当前楼层：${current}`);
      } else if (current > targetFloor) {
        current--;
        console.log(`电梯正在下行，当前楼层：${current}`);
      } else {
        clearInterval(intervalId); // 停止定时器
        resolve(current); // 返回最终楼层
      }
    }, 2000); // 模拟电梯每隔两秒移动一层
  });
}
</script>

<template>
  <div class="buttons" :id="buttonId">
    <span v-for="buttonNumber in 20" :key="buttonNumber" class="button-box">
      <el-button @click="handleFloors(buttonNumber, currentFloor!, currentElevator!)" class="button" type="info" plain>{{ buttonNumber }}</el-button>
    </span>
    <span class="button-box">
      <el-button @click="operateElevator('open')" class="button" type="warning" :plain="!open">
        <span>
          <CaretLeft style="width: 1em; height: 1em; margin-left: 1px" />
          <CaretRight style="width: 1em; height: 1em; margin-right: 1px" />
        </span>
      </el-button>
    </span>
    <span class="button-box">
      <el-button @click="operateElevator('close')" class="button" type="warning" :plain="!close">
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
        {{ character }}
      </el-button>
    </span>
  </div>
</template>

<style src="../assets/styles.css" scoped>
</style>
