import { defineStore } from "pinia";
import { useElevatorStore } from '@/stores/pressInner.ts';
import { ref, type Ref } from "vue";
 
export const usePublishStore = defineStore('publishStore', () => {
  let distance: number[] = []
  let reqFloor: Ref = ref([])
  let mindis: number = 0
  let id: number = 0
  function publishElevator(buttonNum: number, currentFloors: any) {
    // console.log('currentFloors:', currentFloors.value.map((floor: any) => floor.value));
    reqFloor.value.push(buttonNum)
    distance = []
    console.log(reqFloor);
    

    for (let i = 0; i < 5; i++) {
      const currentFloor = currentFloors[i].value;
      distance.push(Math.abs(currentFloor - buttonNum))

    }

    mindis = distance[0]

    for (let j = 1; j < 5; j++) {
      if(distance[j] < mindis){
        mindis = distance[j]
        id = j 
      }
    }
    id = id + 1

    const { handleFloors } = useElevatorStore();
    handleFloors(buttonNum, currentFloors, id);
    
    for (let i = 0; i < 5; i++) {
        const currentFloor = currentFloors[i].value
        if (currentFloor === buttonNum) {
          reqFloor.value = reqFloor.value.filter((num: number) => num !== buttonNum);
        }
      }
  }

  // 导出 publishElevator
  return {
    publishElevator,
    reqFloor
  };
});