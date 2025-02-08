import { defineStore } from 'pinia'
import { ref, watch, type Ref } from 'vue'

export const useElevatorStore = defineStore('elevatorStore', () => {
let openTimer: any
let closeTimer: any
let character = ref('关')
let activeUpIds = ref<number[]>([])
let activeDownIds = ref<number[]>([])
let openIds = ref(Array.from({ length: 5 }, () => [])) as Ref;
let closeIds = ref(Array.from({ length: 5 }, () => [])) as Ref;
let isDisabledButtons = ref(Array.from({ length: 5 }, () => [])) as Ref;
const opens = Array.from({ length: 5 }, () => ref(false));
const closes = Array.from({ length: 5 }, () => ref(false));
const currentFloors = Array.from({ length: 5 }, () => ref(1)); 

const elevatorStates = Array.from({ length: 5 }, () => ({
  upRequests: ref<number[]>([]), // 上行请求队列
  downRequests: ref<number[]>([]), // 下行请求队列
  currentDirection: ref<'up' | 'down' | 'idle'>('idle'), // 当前运行方向
  isDoorOpen: ref(false), // 电梯门是否正在打开
}));

function handleFloors(buttonNum: number, currentFloors: any, id: number) {
    // console.log(`正在处理${requestFloor}`);
    const currentFloor = currentFloors[id-1]?.value
    const elevatorState = elevatorStates[id-1];
    // const isDisabledButton = isDisabledButtons[id-1]
    const { upRequests, downRequests, currentDirection } = elevatorState
    if(buttonNum !== currentFloor){
      isDisabledButtons.value[id-1].push(buttonNum);
    }
    console.log(isDisabledButtons.value[id-1]);
    //  const changeFloor = currentFloor - buttonNum 
    // const requestFloors = ref<number[]>([])
    console.log(buttonNum, currentFloor);
      if (buttonNum > currentFloor) {
        // 上行请求
        upRequests.value.push(buttonNum);
        upRequests.value = [...new Set(upRequests.value)].sort((a, b) => a - b); // 去重并排序
        console.log(upRequests);
      } else if (buttonNum < currentFloor) {
        // 下行请求
        downRequests.value.push(buttonNum);
        downRequests.value = [...new Set(downRequests.value)].sort((a, b) => b - a); // 去重并排序
      } else {
        console.log('当前楼层就是目标楼层，无需移动电梯。');
        return;
      }

      if (currentDirection.value === 'idle') {
        if (upRequests.value.length > 0) {
          currentDirection.value = 'up';
        } else if (downRequests.value.length > 0) {
          currentDirection.value = 'down';
        }
        processRequests(currentFloors, id);
      }
}

function processRequests(currentFloors: any,id: number) {
  const currentFloor = currentFloors[id - 1].value;
  const elevatorState = elevatorStates[id - 1];
  const { upRequests, downRequests, currentDirection } = elevatorState
  if (currentDirection.value === 'up' && upRequests.value.length > 0) {
    // 处理上行请求
    console.log('我在处理');
    const targetFloor = upRequests.value[0];
    moveElevator(id, currentFloor, targetFloor, 'up').then(() => {
      upRequests.value.shift(); // 移除已处理的请求
      isDisabledButtons.value[id-1] = isDisabledButtons.value[id-1].filter((num: number) => num !== targetFloor);
      console.log(`处理了${targetFloor}`);
      if (upRequests.value.length > 0) {
        processRequests(currentFloors, id); // 继续处理下一个上行请求
      } else {
        currentDirection.value = 'idle'; // 上行完成，切换为空闲状态
        if (downRequests.value.length > 0) {
          currentDirection.value = 'down'; // 如果有下行请求，切换方向
          processRequests(currentFloors, id);
        }
      }
    });
  } else if (currentDirection.value === 'down' && downRequests.value.length > 0) {
    // 处理下行请求
    const targetFloor = downRequests.value[0];
    moveElevator(id, currentFloor, targetFloor, 'down').then(() => {
      downRequests.value.shift(); // 移除已处理的请求
      if (downRequests.value.length > 0) {
        processRequests(currentFloors, id); // 继续处理下一个下行请求
      } else {
        currentDirection.value = 'idle'; // 下行完成，切换为空闲状态
        if (upRequests.value.length > 0) {
          currentDirection.value = 'up'; // 如果有上行请求，切换方向
          processRequests(currentFloors, id);
        }
      }
    });
  } else {
    // 没有请求，电梯空闲
    currentDirection.value = 'idle';
    console.log('空出来了');
  }
}

function moveElevator(id: number, currentFloor: any, targetFloor: number, state: string) {
  return new Promise(async (resolve, reject) => {
    const elevatorState = elevatorStates[id - 1];

    // 如果门正在打开或关闭，等待门关闭
    if (elevatorState.isDoorOpen.value) {
      console.log('电梯门正在打开或关闭，等待门关闭...');
      // 等待门关闭
      await new Promise((resolve) => {
        const unwatch = watch(
          () => elevatorState.isDoorOpen.value,
          (isOpen) => {
            if (!isOpen) {
              unwatch(); // 停止监听
              resolve(null); // 门关闭后继续
            }
          }
        );
      });
    }

    const intervalId = setInterval(() => {
      console.log(`状态${state},${currentFloor},${targetFloor} `);
      if (state === 'up' && currentFloor < targetFloor) {
        if (!activeUpIds.value.includes(id)) {
          activeUpIds.value.push(id);
        }
        currentFloor++;
        currentFloors[id - 1].value = currentFloor;
        console.log(`电梯正在上行，当前楼层：${currentFloor}`);
      } else if (state === 'down' && currentFloor > targetFloor) {
        if (!activeDownIds.value.includes(id)) {
          activeDownIds.value.push(id);
        }
        currentFloor--;
        currentFloors[id - 1].value = currentFloor;
        console.log(`电梯正在下行，当前楼层：${currentFloor}`);
      } else {
        clearInterval(intervalId); // 停止定时器
        activeUpIds.value = activeUpIds.value.filter((upId) => upId !== id);
        activeDownIds.value = activeDownIds.value.filter((downId) => downId !== id);
        isDisabledButtons.value[id-1] = isDisabledButtons.value[id-1].filter((num: number) => num !== targetFloor);

        // 到达目标楼层后，先开门，再等待关门完成
        operateElevator('open', opens, id).then(() => {
          resolve(currentFloor); // 关门完成后 resolve
        });

        console.log('停止');
      }
    }, 2000); // 隔两秒移动一层
  });
}

function operateElevator(action: 'open' | 'close', buttons: any, id: number) {
  return new Promise<void>((resolve) => {
    const open = buttons[id - 1];
    const close = buttons[id - 1];
    const elevatorState = elevatorStates[id - 1];

    if (action === 'open') {
      open.value = true;
      close.value = false;
      elevatorState.isDoorOpen.value = true; 
      openIds.value[id - 1].push(id);

      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }

      openTimer = setTimeout(() => {
        open.value = false;
        openTimer = null;
        openIds.value[id - 1] = openIds.value[id - 1].filter((openId: number) => openId !== id);

        // 开门完成后，执行关门操作
        operateElevator('close', buttons, id).then(() => {
          resolve(); // 关门完成后 resolve
        });
      }, 5000); // 开门 7 秒

    } else if (action === 'close') {
      close.value = true;
      open.value = false;
      closeIds.value[id - 1].push(id);

      if (openTimer) {
        clearTimeout(openTimer);
        openTimer = null;
      }

      closeTimer = setTimeout(() => {
        close.value = false;
        closeTimer = null;
        closeIds.value[id - 1] = closeIds.value[id - 1].filter((closeId: number) => closeId !== id);
        elevatorState.isDoorOpen.value = false; 
        resolve(); // 关门完成后 resolve
      }, 2000); // 关门 3 秒
    }
  });
}

return {
  currentFloors,
  character,
  operateElevator,
  handleFloors,
  activeUpIds,
  activeDownIds,
  opens,
  closes,
  openIds,
  closeIds,
  elevatorStates,
  isDisabledButtons
}
})

