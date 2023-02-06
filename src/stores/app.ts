import { ref } from "vue";
import { defineStore } from "pinia";
import type { Ref } from "vue";
import type {WorkoutData} from "@timuism/torc"

export const useAppStore = defineStore("app", () => {
  const workouts:Ref<WorkoutData[]> = ref([])
  const newWorkout = ref()

  function updateNewWorkout (workout: any) {
    newWorkout.value = workout
  }

  function addWorkout(workout: WorkoutData) {
    workouts.value.push(workout)
  }

  return { workouts, newWorkout, updateNewWorkout, addWorkout };
});
